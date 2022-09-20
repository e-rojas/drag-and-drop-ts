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
type Listener<T> = (items: T[]) => void;
/* state class */
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
class DragAndDropProjectState extends State<Project> {
  //   private listeners: Listener[];
  private projects: Project[];
  private static instance: DragAndDropProjectState;
  private constructor() {
    super();
    // this.listeners = [];
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

  addListener(listenerFn: Listener<Project>) {
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
class DragAndDropProjectForm extends Component<
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

const projecForm = new DragAndDropProjectForm();
const activeProjectList = new DragAndDropProjectList('active');
const finishedProjectList = new DragAndDropProjectList('finished');
