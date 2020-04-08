import { TreeNode, CompositeTreeNode } from './TreeNode';
import { Emitter, DisposableCollection, Mutable } from '@ali/ide-core-common';
import { ITreeNodeOrCompositeTreeNode, ITree } from '../types';

export abstract class Tree implements ITree {
  protected _root: CompositeTreeNode | undefined;
  protected readonly onChangedEmitter = new Emitter<void>();
  protected readonly onNodeRefreshedEmitter = new Emitter<CompositeTreeNode>();
  protected readonly toDispose = new DisposableCollection();

  protected nodes: {
    [id: string]: Mutable<TreeNode> | undefined,
  } = {};

  get onNodeRefreshed() {
    return this.onNodeRefreshedEmitter.event;
  }

  dispose(): void {
    this.toDispose.dispose();
  }

  get root(): CompositeTreeNode | undefined {
    return this._root;
  }

  set root(root: CompositeTreeNode | undefined) {
    this._root = root;
    if (this.root) {
      this.root.ensureLoaded();
    }
  }

  protected fireChanged(): void {
    this.onChangedEmitter.fire(undefined);
  }

  abstract async resolveChildren(parent?: CompositeTreeNode): Promise<(CompositeTreeNode | TreeNode)[] | null>;

  sortComparator(a: ITreeNodeOrCompositeTreeNode, b: ITreeNodeOrCompositeTreeNode) {
    if (a.constructor === b.constructor) {
      return a.name > b.name ? 1
        : a.name < b.name ? -1
          : 0;
    }
    return CompositeTreeNode.is(a) ? -1
      : CompositeTreeNode.is(b)  ? 1
        : 0;
  }
}