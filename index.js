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
      if (action === 'Criar conta') {
        createAccount();
      } else if (action === 'Consultar saldo') {
        getAccountBalance();
      } else if (action === 'Depositar') {
        deposit();
      } else if (action === 'Sacar') {
        widthdraw();
      } else if (action === 'Sair') {
        console.log(
          chalk.bgBlue.black('Obrigado por usar os nossos serviços!')
        );
        process.exit();
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
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da conta?',
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName;
      if (!checkAccount(accountName)) {
        return deposit();
      }

      inquirer
        .prompt([
          {
            name: 'amount',
            message: 'Valor do deposito',
          },
        ])
        .then((answer) => {
          const amount = answer.amount;

          addAmount(accountName, amount);
          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

const checkAccount = (account) => {
  if (!fs.existsSync(`accounts/${account}.json`)) {
    console.log(chalk.bgRed.black('Está conta não existe, escolha outro nome'));

    return false;
  }
  return true;
};

const addAmount = (accountName, amount) => {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!')
    );
    return deposit();
  }

  accountData.balance += parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(
    chalk.green(`Foi depositado o valor de R$${amount} na conta ${accountName}`)
  );
};

const widthdrawAmoun = (accountName, amount) => {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!')
    );
    return widthdraw();
  }

  accountData.balance -= parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(
    chalk.green(
      `Foi realizado um saque no valor de R$${amount} da conta ${accountName}`
    )
  );
};

const getAccount = (accountName) => {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf-8',
    flag: 'r',
  });

  return JSON.parse(accountJSON);
};

const getAccountBalance = () => {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da conta',
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName;

      if (!checkAccount(accountName)) {
        return getAccountBalance();
      }

      const accountData = getAccount(accountName);
      console.log(chalk.bgBlue.black(`Seu saldo é: R$${accountData.balance}`));
      operation();
    })
    .catch((err) => console.log(err));
};

const widthdraw = () => {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da conta',
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName;

      if (!checkAccount(accountName)) {
        return widthdraw();
      }

      inquirer
        .prompt([
          {
            name: 'amount',
            message: 'Valor do saque',
          },
        ])
        .then((answer) => {
          const amount = answer.amount;

          widthdrawAmoun(accountName, amount);
          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
operation();
