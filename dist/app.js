"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function autoBind(_target, _methodName, descriptor) {
    const mainMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFunction = mainMethod.bind(this);
            return boundFunction;
        },
    };
    return adjDescriptor;
}
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class DragAndDropProjectState extends State {
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
const projectState = DragAndDropProjectState.getInstance();
class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        this.element = document.importNode(this.templateElement.content, true)
            .firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtbeginning) {
        this.hostElement.insertAdjacentElement(insertAtbeginning ? 'afterbegin' : 'beforeend', this.element);
    }
}
class ProjectItem extends Component {
    constructor(hostId, project) {
        super('single-project', hostId, false, project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    get persons() {
        if (this.project.people === 1) {
            return '1 person';
        }
        else {
            return `${this.project.people} persons`;
        }
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(_event) { }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = ` ${this.persons} assigned`;
        this.element.querySelector('p').textContent = this.project.description;
    }
}
__decorate([
    autoBind
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    autoBind
], ProjectItem.prototype, "dragEndHandler", null);
class DragAndDropProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.assignProjects = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul');
            listEl.classList.add('droppable');
        }
    }
    dropHandler(event) {
        const projectId = event.dataTransfer.getData('text/plain');
        projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }
    dragLeaveHandler(_event) {
        const listEl = this.element.querySelector('ul');
        listEl.classList.remove('droppable');
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('drop', this.dropHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        projectState.addListener((projects) => {
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
    renderProjects() {
        const listElement = document.getElementById(`${this.type}-projects-list`);
        listElement.innerHTML = '';
        for (const projectItem of this.assignProjects) {
            new ProjectItem(this.element.querySelector('ul').id, projectItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent =
            this.type.toUpperCase() + ' PROJECTS';
    }
}
__decorate([
    autoBind
], DragAndDropProjectList.prototype, "dragOverHandler", null);
__decorate([
    autoBind
], DragAndDropProjectList.prototype, "dropHandler", null);
__decorate([
    autoBind
], DragAndDropProjectList.prototype, "dragLeaveHandler", null);
class DragAndDropProjectForm extends Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInput = this.element.querySelector('#title');
        this.descriptionInput = this.element.querySelector('#description');
        this.usersInput = this.element.querySelector('#users');
        this.configure();
    }
    gatherUserInput() {
        const title = this.titleInput.value;
        const description = this.descriptionInput.value;
        const users = this.usersInput.value;
        if (title.trim().length === 0 ||
            description.trim().length === 0 ||
            users.trim().length === 0) {
            alert('all fields are required');
            return;
        }
        return [title, description, +users];
    }
    clearInput() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.usersInput.value = '';
    }
    renderContent() { }
    submitFormHandler(event) {
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
__decorate([
    autoBind
], DragAndDropProjectForm.prototype, "submitFormHandler", null);
const projecForm = new DragAndDropProjectForm();
const activeProjectList = new DragAndDropProjectList('active');
const finishedProjectList = new DragAndDropProjectList('finished');
//# sourceMappingURL=app.js.map