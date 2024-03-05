import inquirer from 'inquirer';
export const prompt = () => {
  const questions = [
    {
      name: 'vueIsJsx',
      type: 'confirm',
      message: '请输入页面路由?',
      framework: ['vue'],
    },
    {
      name: 'analysis',
      type: 'confirm',
      message: '是否需要开启依赖分析?',
      framework: ['vue', 'react'],
    },
    {
      name: 'polyfill',
      type: 'confirm',
      message: '是否需要开启polyfill?',
      framework: ['vue', 'react'],
    },
    {
      name: 'html_plugin',
      type: 'confirm',
      message: '是否需要开启html_plugin?',
      framework: ['vue', 'react'],
    },
  ];
  return inquirer.prompt(questions);
};
prompt()
