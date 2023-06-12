import { Socket } from '@core/services';
import { PostDocument, CommentDocument } from '@providers/mongoose/models';
import {
    AddPostReduxActionDto,
    DeletePostReduxActionDto,
    AddCommentReduxActionDto,
    DeleteCommentReduxActionDto
} from './dtos/redux-action.dto';
import { Injectable } from '@core/decorators';

Injectable();
export class SocketRepository {
    /**
     * Send post redux action to client by user id and action type
     * that represent a post added
     * @param payload PostDocument
     * @returns void
     */
    public postAdded(payload: PostDocument) {
        const reduxAction = new AddPostReduxActionDto();
        reduxAction.payload = payload;

        Socket.emit(reduxAction);
    }

    /**
     * Send post redux action to client by user id and action type
     * that represent a post deleted
     * @param payload PostDocument
     * @returns void
     */
    public postDeleted(payload: PostDocument) {
        const reduxAction = new DeletePostReduxActionDto();
        reduxAction.payload = payload;

        Socket.emit(reduxAction);
    }

    /**
     * Send comment redux action to client by user id and action type
     * that represent a comment added
     * @param payload CommentDocument
     * @returns void
     */
    public commentAdded(payload: CommentDocument) {
        const reduxAction = new AddCommentReduxActionDto();
        reduxAction.payload = payload;

        Socket.emit(reduxAction);
    }

    /**
     * Send comment redux action to client by user id and action type
     * that represent a comment deleted
     * @param payload CommentDocument
     * @returns void
     */
    public commentDeleted(payload: CommentDocument) {
        const reduxAction = new DeleteCommentReduxActionDto();
        reduxAction.payload = payload;

        Socket.emit(reduxAction);
    }
}
