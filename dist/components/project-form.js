var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { autoBind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
import { Component } from './base-component.js';
export class DragAndDropProjectForm extends Component {
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
//# sourceMappingURL=project-form.js.map