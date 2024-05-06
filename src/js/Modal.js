const uuid = require('uuid');

export default class Modal {
    constructor(type, data = {}) {
        this.type = type;  //type: 1 - добавить тикет, 2 - редактировать тикет, 3 - удалить тикет
        this.form = document.createElement('div');
        this.promise = null;
        let descr = '';
        switch (this.type) {
            case 1:
                descr = 'Добавить тикет';
                break;
            case 2:
                descr = 'Редактировать тикет';
                break;
            case 3:
                descr = 'Удалить тикет';
        }
        let { id, name, description } = data;
        id = !id ? uuid.v4().replace(/-/g,''):id;
        name = !name ? '' : name;
        description = !description ? '' : description;

        this.form.innerHTML = `
        <div class="form-popup">
            <span class="head-add">${descr}</span>
            <div class="form-descr">
                <label for="descr-short-add">Краткое описание</label>
                <textarea id="descr-short-add" class="descr-ticket" name="descr-short">${name}</textarea>
                <label for="descr-detail-add">Подробное описание</label>
                <textarea id="descr-detail-add" class="descr-ticket" name="descr-detail">${description}</textarea>
            </div>
            <div class="form-btn">
                <button class="btn-popup btn-cancel">Отмена</button>
                <button class="btn-popup btn-ok">Ок</button>
            </div>
        </div>
        `;
        this.form.id = id;
        this.form.querySelector('.btn-cancel').addEventListener('click', this.onClickCancel.bind(this));
        this.form.querySelector('.btn-ok').addEventListener('click', this.onClickOk.bind(this));
        document.body.append(this.form);
    }

    async show() {
        this.form.classList.remove('hidden');
        return new Promise((resolve) => {
            this.form.addEventListener('close', (event) => {
                resolve({ 'status': 'OK', 'data': event.detail });
            });
        });
    }

    close(detail = null) {
        const event = new CustomEvent('close', { 'bubbles': true, 'detail': detail });
        this.form.dispatchEvent(event);
        this.form.remove();
    }

    onClickCancel(event) {
        event.preventDefault();
        this.close();
    }

    onClickOk(event) {
        event.preventDefault();
        const name = this.form.querySelector('[name="descr-short"]').value;
        const descr = this.form.querySelector('[name="descr-detail"]').value;
        this.close({ 'id': this.form.id, 'name': name, 'description': descr });
    }

}