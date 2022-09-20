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

/* enum project status */
enum ProjectStatus {
  Active,
  Finished,
}

/* Project */
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

/* Project state */
type Listener = (items: Project[]) => void;
class DragAndDropProjectState {
  private listeners: Listener[];
  private projects: any[];
  private static instance: DragAndDropProjectState;
  private constructor() {
    this.listeners = [];
    this.projects = [];
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
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new DragAndDropProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }
}

const projectState = DragAndDropProjectState.getInstance();

/* Component */
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;
    this.element = document.importNode(this.templateElement.content, true)
      .firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtbeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtbeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }
  abstract configure(): void;
  abstract renderContent(): void;
}

/* List  */
class DragAndDropProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignProjects: Project[] = [];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.configure();
    this.renderContent();
  }
  configure(): void {
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
      const listItem = document.createElement('li');
      listItem.textContent = projectItem.title;
      listElement.appendChild(listItem);
    }
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }
}
class DragAndDropProjectForm {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  usersInput: HTMLInputElement;

  constructor() {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById('project-input')!
    );
    this.hostElement = <HTMLDivElement>document.getElementById('app')!;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';
    this.titleInput = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInput = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.usersInput = this.element.querySelector('#users') as HTMLInputElement;

    /* --- */
    this.attach();
    this.formControl();
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

  private formControl() {
    this.element.addEventListener('submit', this.submitFormHandler.bind(this));
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const projecForm = new DragAndDropProjectForm();
const activeProjectList = new DragAndDropProjectList('active');
const finishedProjectList = new DragAndDropProjectList('finished');
