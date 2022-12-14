import { createContext, useReducer } from "react";
import { boardReducer } from "reducers/boardReducer";
import { API_ROOT } from "utilities/constans";
import axios from "axios";

export const BoardContext = createContext();

const BoardContentProvider = ({ children }) => {
    // State
    const [boardState, dispatch] = useReducer(boardReducer, {
        boards: [],
        boardsLoading: true,
    });

    // Get all boards
    const getBoards = async () => {
        try {
            const response = await axios.get(`${API_ROOT}/v1/boards`);
            if (response.data.success) {
                dispatch({
                    type: "BOARDS_LOADED_SUCCESS",
                    payload: response.data.boards,
                });
            }
        } catch (error) {
            dispatch({ type: "BOARDS_LOADED_FAIL" });
        }
    };

    // Add board
    const addBoard = async (newBoard) => {
        try {
            const checkLogin = await axios.get(`${API_ROOT}/v1/auth`);
            const newBoardToAdd = {
                ...newBoard,
                userId: checkLogin.data.user._id,
            };
            const response = await axios.post(
                `${API_ROOT}/v1/boards`,
                newBoardToAdd
            );
            dispatch({ type: "ADD_BOARD", payload: response.data });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    // Delete board
    const deleteBoard = async (board) => {
        try {
            const checkLogin = await axios.get(`${API_ROOT}/v1/auth`);
            const boardToDelete = {
                ...board,
                userId: checkLogin.data.user._id,
            };
            const response = await axios.delete(`${API_ROOT}/v1/boards`, {
                data: boardToDelete,
            });
            dispatch({ type: "DELETE_BOARD", payload: board });
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Update board
    const updateBoard = async (board) => {
        try {
            const boardToUpdate = {
                title: board.title,
                cover: board.cover,
            };
            const response = await axios.put(
                `${API_ROOT}/v1/boards/${board._id}`,
                boardToUpdate
            );
            dispatch({ type: "UPDATE_BOARD", payload: board });
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Post context data
    const boardContextData = {
        boardState,
        getBoards,
        addBoard,
        deleteBoard,
        updateBoard,
    };

    return (
        <BoardContext.Provider value={boardContextData}>
            {children}
        </BoardContext.Provider>
    );
};

export default BoardContentProvider;
