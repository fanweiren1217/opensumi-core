import { Injectable } from '@ali/common-di';
import mm from '@ali/mm';
import { MockInjector } from '../src/mock-injector';
import { createBrowserInjector, createNodeInjector } from '../src/injector-helper';

describe(__filename, () => {
  let fn1: jest.Mock<any, any>;
  let fn2: jest.Mock<any, any>;

  @Injectable()
  class A {
    log = fn1;
  }

  beforeEach(() => {
    fn1 = jest.fn();
    fn2 = jest.fn();
  });

  describe('手动创建 injector', () => {
    let injector: MockInjector;

    beforeEach(() => {
      injector = new MockInjector();
    });

    it('基本的 mm 测试', () => {
      const a = new A();
      mm(a, 'log', fn2);
      a.log();

      expect(fn1).toBeCalledTimes(0);
      expect(fn2).toBeCalledTimes(1);
    });

    it('能够正常 mock 一个依赖注入的对象', () => {
      injector.mock(A, 'log', fn2);

      const args = [1, '2', true];
      const a = injector.get(A);
      a.log(...args);

      expect(fn1).toBeCalledTimes(0);
      expect(fn2).toBeCalledTimes(1);
      expect(fn2).toBeCalledWith(...args);
    });

    it('不 mock 的时候正常运行', () => {
      const args = [1, '2', true];
      const a = injector.get(A);
      a.log(...args);

      expect(fn1).toBeCalledTimes(1);
      expect(fn1).toBeCalledWith(...args);
    });
  });

  describe('通过辅助函数创建 injector', () => {
    it('能够使用 Browser 环境的 Injector 进行 mock', () => {
      const injector = createBrowserInjector([]);
      injector.mock(A, 'log', fn2);

      const args = [1, '2', true];
      const a = injector.get(A);
      a.log(...args);

      expect(fn1).toBeCalledTimes(0);
      expect(fn2).toBeCalledTimes(1);
      expect(fn2).toBeCalledWith(...args);
    });

    it('能够使用 Node 环境的 Injector 进行 mock', () => {
      const injector = createNodeInjector([]);
      injector.mock(A, 'log', fn2);

      const args = [1, '2', true];
      const a = injector.get(A);
      a.log(...args);

      expect(fn1).toBeCalledTimes(0);
      expect(fn2).toBeCalledTimes(1);
      expect(fn2).toBeCalledWith(...args);
    });
  });
});
