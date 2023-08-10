const fs = require('fs');
const path = require('path');

const apps_dir = path.join(__dirname, 'apps');

const target_config_dir = process.argv[2]

if (target_config_dir===undefined) {
	console.log('Direktori tujuan belum didefinisikan');
	process.exit(0);
}

if (!fs.existsSync(target_config_dir)) {
	console.log(`Direktori tujuan '${target_config_dir}' tidak ditemukan.`);
	process.exit(0);
}

if (!fs.lstatSync(target_config_dir).isDirectory()) { 
	console.log(`'${target_config_dir}' bukan direktori.`);
	process.exit(0);
}


console.log(`Reading directory '${apps_dir}' ...`);
var dircontents = fs.readdirSync(apps_dir);
for (var prj_dc_name of dircontents) {
	//console.log(prj_dc_name);
	var prj_path = path.join(apps_dir, prj_dc_name)
	if (!fs.lstatSync(prj_path).isSymbolicLink()) { continue; }
	if (prj_dc_name==='fgta' || prj_dc_name=='etap') { continue; }

	var prj_dircontents = fs.readdirSync(prj_path);
	for (var mod_dc_name of prj_dircontents) {
		var mod_path = path.join(prj_path, mod_dc_name)
		if (mod_dc_name=='.git' && mod_dc_name=='.vscode') { continue; }
		if (!fs.lstatSync(mod_path).isDirectory()) { continue; }

		
		var pro_dircontents = fs.readdirSync(mod_path);
		for (var pro_dc_name of pro_dircontents) {
			var pro_path = path.join(mod_path, pro_dc_name)
			if (!fs.lstatSync(pro_path).isDirectory()) { continue; }

			// console.log(prj_dc_name, mod_dc_name, pro_dc_name);
			var ori_configfile_path = path.join(pro_path, `${pro_dc_name}.json`)
			if (fs.existsSync(ori_configfile_path)) {
				// console.log(ori_configfile_path);

				var ori_configfile_content = fs.readFileSync(ori_configfile_path)
				var ori_config = JSON.parse(ori_configfile_content)

				var config_to_copy = {
					allowanonymous: ori_config.allowanonymous,
					allowedgroups: ori_config.allowedgroups,
					apis: ori_config.apis
				}

				var config_string = JSON.stringify(config_to_copy, null, 4);

				var config_filename = `${prj_dc_name}#${mod_dc_name}#${pro_dc_name}.json`
				var config_filepath = path.join(target_config_dir, config_filename)

				if (!fs.existsSync(config_filepath)) {
					console.log('writing config file', config_filename, '..')
					fs.writeFileSync(config_filepath, config_string)
				}
				
				

			}
		}
	}

}

