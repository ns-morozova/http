export default class queryDB {
    static URL = 'http://127.0.0.1:7070';

    static async query(type, param, objData = null) {
        let strParam = '';

        for(let key in param) {
            if(strParam == '') {
                strParam = key + '=' + param[key];
            } else {
                strParam = strParam + '&' + key + '=' + param[key];
            }
        }

        strParam = '?' + strParam;
        try {
            const options = {
                method: type               
            }
            if(type == 'POST') {
                options.body = JSON.stringify(objData);
                options.headers = { 'Content-Type': 'application/json' };
                //options.mode = "no-cors";

            }
            const response = await fetch(this.URL + strParam, options);
            let json = undefined;
            if (response.ok) { 
                if(type == 'GET') {
                    json = await response.json();
                }  
            }
            console.log('Статус: ' + response.ok);
            return {'status': response.status, 'data': json};
        } catch(err) {
            console.log(err);
        }

    }

}