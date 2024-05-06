import queryDB from "./queryDB";
import Modal from "./Modal";
import Ticket from "./Ticket";

export default class Controller {
    constructor(element) {
        this.container = element;
        this.tickets = [];
    }

    init() {
        const btn = document.querySelector('.ticket-add');
        btn.addEventListener('click', this.onClickAddTicket.bind(this));

        const formAdd = document.querySelector('.form-popup-add');
        formAdd.querySelector('.btn-cancel').addEventListener('click', this.onClickCancelAdd.bind(this));
        formAdd.querySelector('.btn-ok').addEventListener('click', this.onClickOkAdd.bind(this));

        const formEdit = document.querySelector('.form-popup-edit');
        formEdit.querySelector('.btn-cancel').addEventListener('click', this.onClickCancelEdit.bind(this));
        formEdit.querySelector('.btn-ok').addEventListener('click', this.onClickOkEdit.bind(this));

        queryDB.query('GET', { 'method': 'allTickets' }).then((response) => {
            if(response.status !== 200) {
                alert('Ошибка получения данных!');
                return;
            }
            for(let objTicket of response.data) {
                this.addTiket(objTicket);
            }
        });

    }

    addTiket(objTicket){
        let ticket = document.createElement('div');
        ticket.classList.add('ticket');
        ticket.innerHTML = `
                    <div class="task">
                            <input type="checkbox" id="scales" name="scales" ${objTicket.status ? 'checked' : ''}/>
                            <label for="scales">${objTicket.name}</label>
                    </div>

                    <div class="info">
                        <span>${this.getFormatData(objTicket.created)}</span>
                        <div class="icons">
                            <img class="icon icon-edit" src="pencil_ctfnc1wpi1j0.svg" width="10" height="10" alt="correct">
                            <img class="icon icon-delete" src="close_14xpqtqf4d7h.svg" width="10" height="10" alt="close">
                        </div>
                    </div>
                `;
        ticket.id = objTicket.id;
        document.querySelector('.tickets').append(ticket);
        this.tickets.push(new Ticket(ticket));
    }

    onClickAddTicket(event) {
        event.preventDefault();

        const modal = new Modal(1);
        const promise = modal.show();
        promise.then((resolve) => {
            const objData = resolve.data;
            if (!objData) {
                return;
            }
            const date = new Date();
            objData.created = Math.floor(date.getTime() / 1000);

            queryDB.query('POST', { 'method': 'createTicket' }, objData).then((response) => {
                if (response.status == 200) {
                    this.addTiket(objData);
                }               
            });
        });

    }

    onClickCancelAdd(event) {
        event.preventDefault();
    }

    onClickOkAdd(event) {
        event.preventDefault();
    }

    onClickCancelEdit(event) {
        event.preventDefault();
    }

    onClickOkEdit(event) {
        event.preventDefault();
    }

    getFormatData(timestamp){
        // создаете Date-объект с вашим timestamp
        const date = new Date(timestamp * 1000);
        // извлекаем часы
        const hours = date.getHours();
        // минуты
        const minutes = date.getMinutes();
        // секунды
        const seconds = date.getSeconds();
        // показываем в нужном формате: 11:17:23 
        const time = hours + ':' + minutes + ':' + seconds;        
        return time;
    }
}