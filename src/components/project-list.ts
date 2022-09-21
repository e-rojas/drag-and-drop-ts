import { autoBind } from '../decorators/autobind';
import { DragTarget } from '../models/drag-drop';
import { Project, ProjectStatus } from '../models/project';
import { projectState } from '../state/project-state';
import { Component } from './base-component';
import { ProjectItem } from './project-item';

/* List  */
export class DragAndDropProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignProjects: Project[] = [];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.configure();
    this.renderContent();
  }

  @autoBind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autoBind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      projectId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autoBind
  dragLeaveHandler(_event: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure(): void {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.assignProjects = relevantProjects;
      this.renderProjects();
    });
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listElement.innerHTML = '';
    for (const projectItem of this.assignProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
    }
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }
}
