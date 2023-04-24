import * as core from '@actions/core';
import { run } from '../src/main';

jest.mock('@actions/core');

describe('Test action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successful match with no groups', async () => {
    (core.getInput as jest.Mock)
        .mockReturnValueOnce('hello world')
        .mockReturnValueOnce('world')
        .mockReturnValueOnce('');

    await run();

    expect(core.setOutput).toHaveBeenCalledWith('match', 'world');
  });

  test('successful match with groups', async () => {
    (core.getInput as jest.Mock)
        .mockReturnValueOnce('hello world')
        .mockReturnValueOnce('(hello) (world)')
        .mockReturnValueOnce('');

    await run();

    expect(core.setOutput).toHaveBeenCalledWith('match', 'hello world');
    expect(core.setOutput).toHaveBeenCalledWith('group1', 'hello');
    expect(core.setOutput).toHaveBeenCalledWith('group2', 'world');
  });

  test('no match', async () => {
    (core.getInput as jest.Mock)
        .mockReturnValueOnce('hello world')
        .mockReturnValueOnce('bye')
        .mockReturnValueOnce('');

    await run();

    expect(core.setOutput).not.toHaveBeenCalled();
  });

  test('invalid regex', async () => {
    (core.getInput as jest.Mock)
        .mockReturnValueOnce('hello world')
        .mockReturnValueOnce('[invalid')
        .mockReturnValueOnce('');

    await run();

    expect(core.error).toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalled();
  });

  test('limit output to 10', async () => {
    (core.getInput as jest.Mock)
        .mockReturnValueOnce('hello world')
        .mockReturnValueOnce('(h)(e)(l)(l)(o) (w)(o)(r)(l)(d)')
        .mockReturnValueOnce('');

    await run();

    expect(core.setOutput).toHaveBeenCalledTimes(10);
    expect(core.setOutput).toHaveBeenCalledWith('match', 'hello world');
  });
});
