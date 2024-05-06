export default class Ticket {
    constructor(element) {
        this.ticket = element;
        this.ticket.querySelector('.icon-edit').addEventListener('click', this.onClickEdit.bind(this));
        this.ticket.querySelector('.icon-delete').addEventListener('click', this.onClickDelete.bind(this));
    }

    onClickEdit(event){
        event.preventDefault();
        console.log('Edit');
    }

    onClickDelete(event) {
        event.preventDefault();
        console.log('Delete');
    }
    
}