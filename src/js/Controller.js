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

        this.container.addEventListener('edit', this.onClickEdit.bind(this));
        this.container.addEventListener('delete', this.onClickDelete.bind(this));

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
        ticket.id = objTicket.id;
        ticket.classList.add('ticket');
        ticket.innerHTML = `
                    <div class="task">
                            <div class="inp-check">
                                 <img class="img-check ${objTicket.checked ? '' : 'hidden'}" src="checkmark_0btrup04y0p6.svg" width="14" height="14">
                            </div>
                            <div class="descrs">
                                <span>${objTicket.name}</span> 
                                <span class="descr hidden">${objTicket.description}</span>
                            </div>    
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
            objData.checked = false;

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


    onClickEdit(event) {
        event.preventDefault();
        queryDB.query('GET', { 'method': 'ticketById', 'id':  event.detail}).then((response) => {
            if (response.status == 200) {
                const modal = new Modal(2, response.data);
                const promise = modal.show();
                promise.then((resolve) => {
                    const objData = resolve.data;
                    if (!objData) {
                        return;
                    }
                    queryDB.query('POST', { 'method': 'updateById', 'id': objData.id }, objData).then((response) => {
                        if (response.status == 200) {
                            const ticket = this.container.querySelector(`[id="${objData.id}"]`);
                            const label = ticket.querySelector('[for="scales"]');
                            label.textContent = objData.name;
                        }
                    });
                });

            }
        });
    }

    onClickDelete(event) {
        event.preventDefault();

        queryDB.query('GET', { 'method': 'ticketById', 'id': event.detail }).then((response) => {
            if (response.status == 200) {
                const modal = new Modal(3, response.data);
                const promise = modal.show();
                promise.then((resolve) => {
                    const objData = resolve.data;
                    if (!objData) {
                        return;
                    }
                    queryDB.query('DELETE', { 'method': 'deleteById', 'id': objData.id }).then((response) => {
                        if (response.status == 200) {
                            const ticket = this.container.querySelector(`[id="${event.detail}"]`);
                            const tickArr = this.tickets.find((elem) => elem == ticket);
                            this.tickets.splice(this.tickets.indexOf(tickArr), 1);
                            ticket.remove();
                        }
                    });
                });

            }
        });

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