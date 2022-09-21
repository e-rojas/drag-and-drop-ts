// import { DragTarget } from './models/drag-drop.js';
// import { autoBind } from './decorators/autobind.js';
// import { Project, ProjectStatus } from './models/project.js';
// import { projectState } from './state/project-state.js';
import { DragAndDropProjectForm } from './components/project-form.js';
import { DragAndDropProjectList } from './components/project-list.js';
// // decorator
// function autoBind(
//   _target: any,
//   _methodName: string,
//   descriptor: PropertyDescriptor
// ) {
//   const mainMethod = descriptor.value;
//   const adjDescriptor: PropertyDescriptor = {
//     configurable: true,
//     get() {
//       const boundFunction = mainMethod.bind(this);
//       return boundFunction;
//     },
//   };
//   return adjDescriptor;
// }

// /* drag drop interface */

// interface Draggable {
//   dragStartHandler(event: DragEvent): void;
//   dragEndHandler(event: DragEvent): void;
// }

// interface DragTarget {
//   dragOverHandler(event: DragEvent): void;
//   dropHandler(event: DragEvent): void;
//   dragLeaveHandler(event: DragEvent): void;
// }

/* enum project status */
// enum ProjectStatus {
//   Active,
//   Finished,
// }

// /* Project */
// class Project {
//   constructor(
//     public id: string,
//     public title: string,
//     public description: string,
//     public people: number,
//     public status: ProjectStatus
//   ) {}
// }
// /* Project state */
// type Listener<T> = (items: T[]) => void;
// /* state class */
// class State<T> {
//   protected listeners: Listener<T>[] = [];

//   addListener(listenerFn: Listener<T>) {
//     this.listeners.push(listenerFn);
//   }
// }
// class DragAndDropProjectState extends State<Project> {
//   private projects: Project[];
//   private static instance: DragAndDropProjectState;
//   private constructor() {
//     super();
//     this.projects = [];
//   }

//   moveProject(projectId: string, newStatus: ProjectStatus) {
//     const project = this.projects.find((prj) => prj.id === projectId);
//     if (project && project.status !== newStatus) {
//       project.status = newStatus;
//       this.updateListeners();
//     }
//   }

//   private updateListeners() {
//     for (const listenerFn of this.listeners) {
//       listenerFn(this.projects.slice());
//     }
//   }
//   addProject(title: string, description: string, users: number) {
//     const newProject = new Project(
//       Math.random().toString(),
//       title,
//       description,
//       users,
//       ProjectStatus.Active
//     );
//     this.projects.push(newProject);
//     this.updateListeners();
//   }
//   static getInstance() {
//     if (this.instance) {
//       return this.instance;
//     }
//     this.instance = new DragAndDropProjectState();
//     return this.instance;
//   }

//   addListener(listenerFn: Listener<Project>) {
//     this.listeners.push(listenerFn);
//   }
// }

// const projectState = DragAndDropProjectState.getInstance();

// /* Component */
// abstract class Component<T extends HTMLElement, U extends HTMLElement> {
//   templateElement: HTMLTemplateElement;
//   hostElement: T;
//   element: U;
//   constructor(
//     templateId: string,
//     hostElementId: string,
//     insertAtStart: boolean,
//     newElementId?: string
//   ) {
//     this.templateElement = document.getElementById(
//       templateId
//     )! as HTMLTemplateElement;
//     this.hostElement = document.getElementById(hostElementId)! as T;
//     this.element = document.importNode(this.templateElement.content, true)
//       .firstElementChild as U;
//     if (newElementId) {
//       this.element.id = newElementId;
//     }

//     this.attach(insertAtStart);
//   }

//   private attach(insertAtbeginning: boolean) {
//     this.hostElement.insertAdjacentElement(
//       insertAtbeginning ? 'afterbegin' : 'beforeend',
//       this.element
//     );
//   }
//   abstract configure(): void;
//   abstract renderContent(): void;
// }

// /* list item */
// class ProjectItem
//   extends Component<HTMLUListElement, HTMLLIElement>
//   implements Draggable
// {
//   private project: Project;
//   get persons() {
//     if (this.project.people === 1) {
//       return '1 person';
//     } else {
//       return `${this.project.people} persons`;
//     }
//   }
//   constructor(hostId: string, project: Project) {
//     super('single-project', hostId, false, project.id);
//     this.project = project;
//     this.configure();
//     this.renderContent();
//   }
//   @autoBind
//   dragStartHandler(event: DragEvent): void {
//     event.dataTransfer!.setData('text/plain', this.project.id);
//     event.dataTransfer!.effectAllowed = 'move';
//   }
//   @autoBind
//   dragEndHandler(_event: DragEvent): void {}

//   configure(): void {
//     this.element.addEventListener('dragstart', this.dragStartHandler);
//     this.element.addEventListener('dragend', this.dragEndHandler);
//   }
//   renderContent(): void {
//     this.element.querySelector('h2')!.textContent = this.project.title;
//     this.element.querySelector('h3')!.textContent = ` ${this.persons} assigned`;
//     this.element.querySelector('p')!.textContent = this.project.description;
//   }
// }

// /* List  */
// class DragAndDropProjectList
//   extends Component<HTMLDivElement, HTMLElement>
//   implements DragTarget
// {
//   assignProjects: Project[] = [];

//   constructor(private type: 'active' | 'finished') {
//     super('project-list', 'app', false, `${type}-projects`);
//     this.configure();
//     this.renderContent();
//   }

//   @autoBind
//   dragOverHandler(event: DragEvent): void {
//     if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
//       event.preventDefault();
//       const listEl = this.element.querySelector('ul')!;
//       listEl.classList.add('droppable');
//     }
//   }

//   @autoBind
//   dropHandler(event: DragEvent): void {
//     const projectId = event.dataTransfer!.getData('text/plain');
//     projectState.moveProject(
//       projectId,
//       this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
//     );
//   }

//   @autoBind
//   dragLeaveHandler(_event: DragEvent): void {
//     const listEl = this.element.querySelector('ul')!;
//     listEl.classList.remove('droppable');
//   }

//   configure(): void {
//     this.element.addEventListener('dragover', this.dragOverHandler);
//     this.element.addEventListener('drop', this.dropHandler);
//     this.element.addEventListener('dragleave', this.dragLeaveHandler);
//     projectState.addListener((projects: Project[]) => {
//       const relevantProjects = projects.filter((project) => {
//         if (this.type === 'active') {
//           return project.status === ProjectStatus.Active;
//         }
//         return project.status === ProjectStatus.Finished;
//       });
//       this.assignProjects = relevantProjects;
//       this.renderProjects();
//     });
//   }

//   private renderProjects() {
//     const listElement = document.getElementById(
//       `${this.type}-projects-list`
//     )! as HTMLUListElement;
//     listElement.innerHTML = '';
//     for (const projectItem of this.assignProjects) {
//       new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
//     }
//   }

//   renderContent() {
//     const listId = `${this.type}-projects-list`;
//     this.element.querySelector('ul')!.id = listId;
//     this.element.querySelector('h2')!.textContent =
//       this.type.toUpperCase() + ' PROJECTS';
//   }
// }
// class DragAndDropProjectForm extends Component<
//   HTMLDivElement,
//   HTMLFormElement
// > {
//   titleInput: HTMLInputElement;
//   descriptionInput: HTMLInputElement;
//   usersInput: HTMLInputElement;

//   constructor() {
//     super('project-input', 'app', true, 'user-input');
//     this.titleInput = this.element.querySelector('#title') as HTMLInputElement;
//     this.descriptionInput = this.element.querySelector(
//       '#description'
//     ) as HTMLInputElement;
//     this.usersInput = this.element.querySelector('#users') as HTMLInputElement;

//     this.configure();
//   }
//   private gatherUserInput(): [string, string, number] | void {
//     const title = this.titleInput.value;
//     const description = this.descriptionInput.value;
//     const users = this.usersInput.value;
//     if (
//       title.trim().length === 0 ||
//       description.trim().length === 0 ||
//       users.trim().length === 0
//     ) {
//       alert('all fields are required');
//       return;
//     }
//     return [title, description, +users];
//   }

//   private clearInput() {
//     this.titleInput.value = '';
//     this.descriptionInput.value = '';
//     this.usersInput.value = '';
//   }

//   renderContent(): void {}

//   @autoBind
//   private submitFormHandler(event: Event) {
//     event.preventDefault();
//     const userInput = this.gatherUserInput();
//     if (Array.isArray(userInput)) {
//       const [title, description, users] = userInput;
//       projectState.addProject(title, description, users);
//     }
//     this.clearInput();
//   }

//   configure() {
//     this.element.addEventListener('submit', this.submitFormHandler.bind(this));
//   }
// }

new DragAndDropProjectForm();
new DragAndDropProjectList('active');
new DragAndDropProjectList('finished');
