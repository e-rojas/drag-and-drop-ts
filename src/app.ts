// decorator
function autoBind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const mainMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFunction = mainMethod.bind(this);
      return boundFunction;
    },
  };
  return adjDescriptor;
}

class DragAndDropProjectList {
  templateElement: HTMLTemplateElement;
  renderElement: HTMLDivElement;
  sectionElement: HTMLElement;

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.renderElement = document.getElementById('app')! as HTMLDivElement;
    this.sectionElement = document.importNode(
      this.templateElement.content,
      true
    ).firstElementChild as HTMLElement;
    this.sectionElement.id = `${this.type}-projects`;
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.sectionElement.querySelector('ul')!.id = listId;
    this.sectionElement.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private attach() {
    this.renderElement.insertAdjacentElement('beforeend', this.sectionElement);
  }
}
class DragAndDropProjectForm {
  templateElement: HTMLTemplateElement;
  renderElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  usersInput: HTMLInputElement;

  constructor() {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById('project-input')!
    );
    this.renderElement = <HTMLDivElement>document.getElementById('app')!;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = 'user-input';
    this.titleInput = this.formElement.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInput = this.formElement.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.usersInput = this.formElement.querySelector(
      '#users'
    ) as HTMLInputElement;

    /* --- */
    this.attach();
    this.formControl();
  }
  private gatherUserInput() {
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

  @autoBind
  private submitFormHandler(event: Event) {
    event.preventDefault();
    this.gatherUserInput();
    this.clearInput();
  }

  private formControl() {
    this.formElement.addEventListener(
      'submit',
      this.submitFormHandler.bind(this)
    );
  }

  private attach() {
    this.renderElement.insertAdjacentElement('afterbegin', this.formElement);
  }
}

const projecForm = new DragAndDropProjectForm();
const activeProjectList = new DragAndDropProjectList('active');
const finishedProjectList = new DragAndDropProjectList('finished');
