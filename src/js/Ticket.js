import queryDB from "./queryDB";

export default class Ticket {
    constructor(element) {
        this.ticket = element;
        this.ticket.querySelector('.icon-edit').addEventListener('click', this.onClickEdit.bind(this));
        this.ticket.querySelector('.icon-delete').addEventListener('click', this.onClickDelete.bind(this));
        this.ticket.addEventListener('click', this.onClickTicket.bind(this));
        this.ticket.querySelector('.inp-check').addEventListener('click', this.onClickChecked.bind(this))
    }

    onClickEdit(event){
        event.preventDefault();
        this.ticket.dispatchEvent(new CustomEvent('edit', { 'bubbles': true, 'detail': this.ticket.id }));
    }

    onClickDelete(event) {
        event.preventDefault();
        this.ticket.dispatchEvent(new CustomEvent('delete', { 'bubbles': true, 'detail': this.ticket.id }));
    }

    onClickTicket(event) {
        event.preventDefault();
        if (event.target.classList.contains('icon-edit') || event.target.classList.contains('icon-delete') || event.target.closest('.inp-check')) {
            return;
        }

        const descr = this.ticket.querySelector('.descr');
        descr.classList.toggle('hidden');
    }

    onClickChecked(event) {
        event.preventDefault();
        const check = event.target.closest('.inp-check');
        const imgCheck = check.querySelector('.img-check');
        imgCheck.classList.toggle('hidden');
        const checked = !imgCheck.classList.contains('hidden');

        queryDB.query('GET', { 'method': 'ticketById', 'id': this.ticket.id }).then((response) => {
            if (response.status == 200) {
                const objData = response.data;
                objData.checked = checked;

                queryDB.query('POST', { 'method': 'updateById', 'id': objData.id }, objData).then((response) => {
                    if (!response.status == 200) {
                       console.log(response);
                    }
                });

            }
        });
    }
    
}