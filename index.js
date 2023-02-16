import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';

const operation = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
          'Criar conta',
          'Consultar saldo',
          'Depositar',
          'Sacar',
          'Sair',
        ],
      },
    ])
    .then((answer) => {
      const action = answer.action;
      if (action === 'Criar conta') {createAccount()}
      else if(action === 'Consultar saldo'){}
      else if(action === 'Depositar'){
        deposit()
      }
      else if(action === 'Sacar'){}
      else if(action === 'Sair'){
        console.log(chalk.bgBlue.black('Obrigado por usar os nossos serviços!'))
        process.exit()
      }

    })
    .catch((err) => console.log(err));
};

const createAccount = () => {
  console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'));
  console.log(chalk.green('Defina as opçãoes da sua conta a seguir'));
  buildAccount();
};

const buildAccount = () => {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Digite um nome para a sua conta',
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName;

      console.info(accountName);

      if (!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts');
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black('Esta conta já existe, escolha outro nome')
        );
        buildAccount();

        return;
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance": 0}',
        function (err) {
          console.log(err);
        }
      );

      console.log(chalk.green('Parabéns a sua conta foi criada'));
      operation();
    })
    .catch((err) => console.log(err));
};

const deposit = () => {
  inquirer.prompt([{
    name: 'accountName',
    message: 'Qual o nome da sua conta?'
  }]).then((answer) => {
    const accountName =  answer.accountName
     if(!checkAccount(accountName)){
      return deposit()
     }
  })
}

const checkAccount = (account) => {
  if(!fs.existsSync(`accounts/${account}.json`)){
    console.log(chalk.bgRed.black('Está conta não existe, escolha outro nome'));

    return false
  }
  return true
}

operation();
