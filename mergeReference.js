var refTable = 'cmdb_ci';
var whiteList = ['task'];
var sourceSysID = 'dd412bfe4f448680dedeeb1e0210c7d1';
var newReference = 'ce30a8af1b878dd46825ca262a4bcb0e';
var grDict = new GlideRecord('sys_dictionary');
grDict.addQuery('reference', refTable);
grDict.addQuery('internal_type', 'reference');
grDict.query();
gs.info(grDict.getRowCount() + ' ' + refTable + ' dictionary references found');
while (grDict.next()) {
  	var num = 0;
    var pass = false;
    var table = new TableUtils(grDict.name + '');
    var tables = table.getTables();
    for (var i in whiteList) {
        if (tables.indexOf(whiteList[i]) != -1)
            pass = true;
        if (pass) {
          	gs.info('Checking table [' + grDict.name + '] that extends off of ' + whiteList[i]);
            num = 0;
            ref = new GlideRecord(grDict.name + ''); //table
            ref.addQuery(grDict.element + '', sourceSysID); //element is column name
            ref.query();
            while (ref.nextRecord()) {
                ref.setValue(grDict.element + '', newReference);
                ref.setWorkflow(false);
                ref.autoSysFields(false);
                ref.update();
                num++;
                updated = true;
								//gs.info(ref.sys_id + '');
            }
        }
        if (num > 0) {
            var desc = grDict.element + ' changed from ' + sourceSysID + ' to ' + newReference + ' in ' + num + ' ' + grDict.name + ' records';
            gs.log(desc, 'Move Reference');
        }
    }
}
