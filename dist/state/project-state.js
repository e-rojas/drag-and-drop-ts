import { Project, ProjectStatus } from '../models/project.js';
export class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class DragAndDropProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find((prj) => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
    addProject(title, description, users) {
        const newProject = new Project(Math.random().toString(), title, description, users, ProjectStatus.Active);
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
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export const projectState = DragAndDropProjectState.getInstance();
//# sourceMappingURL=project-state.js.map