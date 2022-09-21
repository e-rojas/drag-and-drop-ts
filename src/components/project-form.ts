import { autoBind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
import { Component } from './base-component.js';

export class DragAndDropProjectForm extends Component<
  HTMLDivElement,
  HTMLFormElement
> {
  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  usersInput: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');
    this.titleInput = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInput = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.usersInput = this.element.querySelector('#users') as HTMLInputElement;

    this.configure();
  }
  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInput.value;
    const description = this.descriptionInput.value;
    const users = this.usersInput.value;
    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      users.trim().length === 0
    ) {
      alert('all fields are required');
      return;
    }
    return [title, description, +users];
  }

  private clearInput() {
    this.titleInput.value = '';
    this.descriptionInput.value = '';
    this.usersInput.value = '';
  }

  renderContent(): void {}

  @autoBind
  private submitFormHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, users] = userInput;
      projectState.addProject(title, description, users);
    }
    this.clearInput();
  }

  configure() {
    this.element.addEventListener('submit', this.submitFormHandler.bind(this));
  }
}
