const uuid = require('uuid');

export default class Modal {
    constructor(type, data = {}) {
        this.type = type;  //type: 1 - добавить тикет, 2 - редактировать тикет, 3 - удалить тикет
        this.form = document.createElement('div');
        this.form.classList.add('popup');
        this.promise = null;
        this.data = data;
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
        let { id, name, description } = this.data;
        id = !id ? uuid.v4().replace(/-/g,''):id;
        name = !name ? '' : name;
        description = !description ? '' : description;

        if(this.type < 3) {
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
        } else {
            this.form.innerHTML = `
                <div class="form-popup">
                    <span class="head-add">${descr}</span>
                    <span>Вы уверены, что хотите удалить тикет? Отменить это действие будет невозможно.</span>
                    
                    <div class="form-btn">
                        <button class="btn-popup btn-cancel">Отмена</button>
                        <button class="btn-popup btn-ok">Ок</button>
                    </div>
                </div>
                `;
        }

        this.form.dataset.id = id;
        this.form.querySelector('.btn-cancel').addEventListener('click', this.onClickCancel.bind(this));
        this.form.querySelector('.btn-ok').addEventListener('click', this.onClickOk.bind(this));
        this.form.classList.add('open');
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
        const data = { 'id': this.form.dataset.id};
        if(this.type < 3) {
            data.name = this.form.querySelector('[name="descr-short"]').value;
            data.description = this.form.querySelector('[name="descr-detail"]').value;
            data.created = this.data.created;
            data.checked = this.data.checked;
        }
        
        this.close(data);
    }

}