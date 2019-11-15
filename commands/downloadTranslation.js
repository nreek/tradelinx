import request from 'request';
import fs from 'fs';
import poeditorConfig from '../config/poeditorConfig';

const token = poeditorConfig.token;
const id = poeditorConfig.projectId;
const languages = poeditorConfig.languages;

languages.forEach((lang) => {
    const req = {
        url: 'https://api.poeditor.com/v2/terms/list',
        method: 'POST',
        json: true,
        body: 'api_token=' + token + '&id=' + id + '&language='+lang,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };
  
      request(req, (err, res) => {
        if (err) {
            return false;
        }

        const json = {};

        res.body.result.terms.forEach(term => {
            json[term.term] = term.translation.content;
        })

        fs.writeFile(`./lang/${lang}.json`, JSON.stringify(json, null, 2), 'utf8', (err) => {
            if (err) console.log(err);
            console.log(`./lang/${lang}.json created`)
        });
      });
})
