export function copyToClipBoard(content){
    
    if(navigator.clipboard.writeText(content)){
        return(true);
    }else{
        return false
    }
    
    
}