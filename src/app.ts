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
class DraDropProject {
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
  @autoBind
  private submitFormHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInput.value);
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

const project = new DraDropProject();
