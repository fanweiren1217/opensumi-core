import { FileStat } from '@ali/ide-file-service';

export interface IMainThreadStoragePath {
  // 构建插件进程的日志路径，当路径不存在时，创建该文件路径
  $provideHostLogPath(): Promise<string>;
  // 根据给定的workspace构建存储路径
  $provideHostStoragePath(workspace: FileStat | undefined, roots: FileStat[]): Promise<string | undefined>;
  // 返回最后使用的存储路径
  $getLastStoragePath(): Promise<string | undefined>;
  // 返回数据存储文件夹
  $getAppDataDirPath(): Promise<string>;
}

export interface IExtHostStoragePath {
  $init?(): void;
}
