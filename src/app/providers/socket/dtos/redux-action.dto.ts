import { IsObject } from 'class-validator';
import { PostDocument, CommentDocument } from '@providers/mongoose/models';

interface ReduxActionDto<T = string, P = object> {
    readonly type: T;

    payload: P;
}
export class AddPostReduxActionDto
    implements ReduxActionDto<string, PostDocument>
{
    public readonly type = 'posts/postAdded';

    @IsObject()
    public payload: PostDocument;
}
export class DeletePostReduxActionDto
    implements ReduxActionDto<string, PostDocument>
{
    public readonly type = 'posts/postDeleted';

    @IsObject()
    public payload: PostDocument;
}

export class UpdatePostReduxActionDto
    implements ReduxActionDto<string, PostDocument>
{
    public readonly type = 'posts/postUpdated';

    @IsObject()
    public payload: PostDocument;
}

export class AddCommentReduxActionDto
    implements ReduxActionDto<string, CommentDocument>
{
    public readonly type = 'comments/commentAdded';

    @IsObject()
    public payload: CommentDocument;
}
export class DeleteCommentReduxActionDto
    implements ReduxActionDto<string, CommentDocument>
{
    public readonly type = 'comments/commentDeleted';

    @IsObject()
    public payload: CommentDocument;
}

export class UpdateCommentReduxActionDto
    implements ReduxActionDto<string, CommentDocument>
{
    public readonly type = 'comments/commentUpdated';

    @IsObject()
    public payload: CommentDocument;
}
