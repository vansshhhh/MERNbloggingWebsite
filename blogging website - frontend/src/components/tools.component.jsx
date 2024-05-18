//importing tools

import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

import {uploadImage} from "../common/aws"


const uploadImageByFile = (e) => {
   return uploadImage(e).then(url => {
       
            return{
                success : 1,
                file:{url}
            }
        })
    }


const uploadImageByURL = (e) => {
    let link = new Promise((resolve, reject) => {
        try{
            resolve(e)
        }
        catch(err){
            reject(err)
        }
    })

    return link.then(url => {
        return {
            success : 1,
            file : {url}
        }
    })
}

const tools = {
    embed : Embed,
    list : {
        class: List,
        inLineToolBar : true
    },
    image : {
        class : Image,
        config : {
            uploader : {
            uploadByUrl: uploadImageByURL,
            uploadByFile: uploadImageByFile
        }
    }
    },
    header : {
        class : Header,
        config : {
            placeholder: "Type Heading......",
            levels: [2,3],
            defaultLevel: 2
        }
    },
    quote : {
        class: Quote,
        inLineToolBar: true
    },
    marker : Marker,
    inlineCode : InlineCode


}

export default tools;