import {Injectable} from "@angular/core";
import { Platform } from "ionic-angular";

@Injectable() export class HtmlHelper {

    constructor(private platform: Platform){

    }

    public getNewLinesHtml(bio_text:string,perform_hash_tag:boolean=true){
        bio_text=bio_text.replace(/\r/g,"");
        bio_text=bio_text.replace(/\n/g,"<br />");

        if (perform_hash_tag){
            bio_text=bio_text.replace(/(^|.|\s)#(\w+)/g, "$1<a href='#' onclick=\"callHashtag(event,'#$2')\">#$2</a>");
        }

        return bio_text;
    }

    public getImageDiv(url:string,title:string):string {
        let html='<div class="post-image">';
        html+='<div class="player" onclick="openFullSizeImage(\''+url+'\')">';
        html+='<img src="'+url+'" alt="'+title+'" />';
        html+='</div>';
        if (title!=""){
            html+='<div class="title">'+title+'</div>';
        }
        html+='</div>';
        return html;
    }

    public getVideoDiv(url:string,title:string):string {
        let html='<div class="post-video">';
        html+='<div class="player">';
        html+='<video src="'+url+'" controls></video>';
        html+='</div>';
        if (title!=""){
            html+='<div class="title">'+title+'</div>';
        }
        html+='</div>';
        return html;
    }

    public getAudioDiv(url:string,title:string):string {
        let html='<div class="post-audio">';
        html+='<div class="player">';
        html+='<audio src="'+url+'" controls></audio>';
        html+='</div>';
        if (title!=""){
            html+='<div class="title">'+title+'</div>';
        }
        html+='</div>';
        return html;
    }

    private processSplittedVals(inputText:string,matchText:string,vals){
        let type=vals[0].trim();
        let url=vals[1].trim();
        if (url=="")
            return inputText;
        let title="";
        if (vals.length>2){
            title=vals[2].trim();
        }
        //console.log("type: "+type+",url: "+url,"title: "+title);
        if (type=="audio"){
            inputText=inputText.replace(matchText,this.getAudioDiv(url,title));
        }else if (type=="video"){
            inputText=inputText.replace(matchText,this.getVideoDiv(url,title));
        }else if (type=="image"){
            inputText=inputText.replace(matchText,this.getImageDiv(url,title));
        }
        return inputText;
    }

    private getMatchSplitted(str:string){
        //skip {{
        let startIndex=2;
        //skip }}
        let endIndex=str.length-3;
        return str.substr(startIndex,endIndex-1).split('|');
    }

    public processMediaRegexMatches(inputText: string,matches: RegExpMatchArray): string {
        let replacedText=inputText;
        for (let a=0;a<matches.length;a++){
            let str=matches[a];
            let vals=this.getMatchSplitted(str);
            if (vals.length<2)
                continue;
            replacedText=this.processSplittedVals(replacedText,str,vals);
        }
        return replacedText;
    }

    public mediaRegexify(inputText: string,pattern: RegExp): string {
        let matches=inputText.match(pattern);
        //console.log(matches);
        if (matches==null || matches.length==0)
            return inputText;
        return this.processMediaRegexMatches(inputText,matches);
    }

    public imageify(inputText:string):string {
        let videoPattern = /(\{\{)(image\|)((https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])((|.)*)(\}\})/gim;
        return this.mediaRegexify(inputText,videoPattern);
    }

    public videofy(inputText:string):string {
        let videoPattern = /(\{\{)(video\|)((https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])((|.)*)(\}\})/gim;
        return this.mediaRegexify(inputText,videoPattern);
    }

    public audiofy(inputText:string):string {
        let audioPattern = /(\{\{)(audio\|)((https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])((|.)*)(\}\})/gim;
        return this.mediaRegexify(inputText,audioPattern);
    }

    public mediafy(inputText:string):string {
        let replacedText=this.audiofy(inputText);
        replacedText=this.videofy(replacedText);
        replacedText=this.imageify(replacedText);
        return replacedText;
    }

    public mailify(inputText:string):string {
        //Change email addresses to mailto:: links.
        let pattern = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        let replacedText = inputText.replace(pattern, '<a href="mailto:$1">$1</a>');
        return replacedText;
    }

    private replaceLinkRegEx(inputText:string,pattern: RegExp){
        return inputText.replace(pattern,'<a href="$1" target="_blank">$1</a>');
    }

    public linkify(inputText) {
        // //URLs starting with http://, https://, or ftp://
        // let pattern = /(?<!['"])(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        // let replacedText = this.replaceLinkRegEx(inputText,pattern);
        // //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        // pattern = /(?<!['"])(^|[^\/])(www\.[\S]+(\b|$))/gim;
        // replacedText = this.replaceLinkRegEx(replacedText,pattern);
        // return replacedText;
        return inputText;
    }

    public processContentHtml(html:string): string {
        let replacedText=this.mediafy(html);
        replacedText=this.linkify(replacedText);
        replacedText = replacedText.replace(/(?:\r\n|\r|\n)/g, '<br />');
        return replacedText;
    }
}