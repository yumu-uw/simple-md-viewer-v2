export namespace model {
	
	export class MDInfo {
	    md_path: string;
	    file_name: string;
	
	    static createFrom(source: any = {}) {
	        return new MDInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.md_path = source["md_path"];
	        this.file_name = source["file_name"];
	    }
	}

}

