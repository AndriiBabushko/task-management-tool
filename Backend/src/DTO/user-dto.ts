export default class UserDto {
    email;
    password;
    id;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.password = model.password;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}