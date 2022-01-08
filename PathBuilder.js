const fs = require('fs');
const p = require('path')

const PathConst = {
    PATH_ROOT: './'
}

class PathExecuter {

    constructor(entry = '', action = () => { console.log('Action')}, config = { }) {
        this.action = action;
        this.entry = entry;
        this.c = config;

        if(this.c.root == undefined)
            this.c.root = PathConst.PATH_ROOT;
        
        this.normalizedPath = p.join(this.c.root, this.entry)
    }

    // retornar lista dos arquivos target e aplica o action
    seek(pattern, path = this.normalizedPath) {

        if (pattern == null || path == null)
            return -1;

        try  {
            fs.readdirSync(path).forEach((file) => {
                if (file.search(pattern) == -1) {
                    try {
                        this.seek(pattern, `${path}/${file}`)
                    }
                    catch(e) { return -1 }
                }
                else {
                    let buildPath = `${path}/${file}`
                    if (this.c.correction != undefined)
                        buildPath = this.c.correction + '/' + buildPath

                    this.action(buildPath)
                }
            })
        }
        catch(e) {  }
    }


    // apply pega a action e aplicar em cada um dos targets
    // deprecated apply() { }
}

module.exports = PathExecuter