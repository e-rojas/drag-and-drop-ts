import { Project, ProjectStatus } from '../models/project.js';

/* Project state */
export type Listener<T> = (items: T[]) => void;
/* state class */
export class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class DragAndDropProjectState extends State<Project> {
  private projects: Project[];
  private static instance: DragAndDropProjectState;
  private constructor() {
    super();
    this.projects = [];
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
  addProject(title: string, description: string, users: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      users,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new DragAndDropProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener<Project>) {
    this.listeners.push(listenerFn);
  }
}

export const projectState = DragAndDropProjectState.getInstance();
