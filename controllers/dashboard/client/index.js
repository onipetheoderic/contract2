import moment from 'moment';
import {encrypt, decrypt} from '../../../utility/encryptor'
import {redirector} from '../../../utility/redirector'


exports.home = function(req, res) {
	res.render('Admin/dashboard_client', {layout: "layout/admin"})  
}
