const setIdReducer = (state,action) =>{
    switch(action.type){
        case "VD_ID":
            return{
                id:action.id
            }
    }
    return state
}

export default setIdReducer