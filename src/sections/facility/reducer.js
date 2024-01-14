export const HANDLERS = {
    GET_DATA: 'GET_DATA',
};

export const initialState = {
    data: null,
};

const handlers = {
    [HANDLERS.GET_DATA]: (state, action) => {
        const data = action.payload;

        return {
            ...state,
            data,
        };
    },
};

export const reducer = (state, action) => (
    handlers[action.type] ? handlers[action.type](state, action) : state
);