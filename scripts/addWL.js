const { parseEther, poll, parseUnits } = require("ethers/lib/utils");
const { upgrades, ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let TokenSale = await ethers.getContractFactory("TokenSaleV2");
  let ts = await TokenSale.attach("");

  console.log("TokenSale address:", ts.address);

  await ts.addAddressesToWhitelist(
    [
      '0x756c404719dcea7dba0bb835c5ed0dc9752480e9',
      '0xeb73767965ec1a80165c66372b622cb6f3c60df2',
      '0x8736c985509c2eda4335e58e56459acdebbd641c',
      '0xc9644126d81e5cf863d392ff12d536cba9982e51',
      '0xfeef70a612298c9f7f3840a4a80b48c5364beb3e',
      '0x481f7feb0a6638b6c0a16f0f04dd982d4de1a20d',
      '0x4f278d0206e310972c4f0812d7e80209a8544fae',
      '0x68e0cd4bbef02fc978e86f9294f25a04b6cd9082',
      '0xa1a0888c9224eb20abd309eafeacec48281f5380',
      '0x5fcc717b7c871d5dbb00c5b24e2ccc2b5a610a85',
      '0x7cf4ea3d0f42ba67e7c3b7cf8e9bfbba120d47a8',
      '0x2f8483783f2527e95f869ec86feae39256bc7261',
      '0x25647167b4e0066173895063bbca664b5e4c4593',
      '0xff0239316dcba383b38feec3118a320ad5972b30',
      '0x6e50cdb7d4620621aed3738c1c7409d8aa67a523',
      '0xc679103ede6cbb2f5b690fb0ba36403f589a3fbc',
      '0x8988b1df123c15964a4e39f0b18f3f44d961c4f9',
      '0x1dd03f57eb2016622fdc6e11fff7a736e984c96e',
      '0xbfa3960a50cbe7f955089a2a741290f173cf6353',
      '0xb17da528c666fad72c9263d35c3597eebee5d02d',
      '0xd6d62cb8475984d7b99104ae30c1879d0cd5c33d',
      '0xea19dcb038d477e918c240c18a0ddf178e41a7c7',
      '0x1f7ffb415b25be9ee0896b317d9a2c27aaaef981',
      '0xd13f369ce467be31bb383f37fa4f5f65e9abfd04',
      '0x299c11ddc5deb6a3892386c9459f9f38da550eb2',
      '0xc4111f072db87ca35145101fa85703d11fe93dbc',
      '0xc3fac1e2d80fa7524731697b03f319104e0d3831',
      '0x8076f84e0926fd57476994518b01f1b2897a25a8',
      '0x3e80a05cfb7ad545171dcbe12ccea0047362a534',
      '0xd5d590e80675866b97d6df5bce1f578985cd258f',
      '0x748f5a46baef0faf1a521c96acc4ded273e17f48',
      '0xc1a24fedb26dc93dd8e8665c9c37caa443e9e564',
      '0xe4143fd2b587004ad88fc7fe89a923ea90c63cd2',
      '0xed1995e22481015e480ac37580fb4079ed8ff8a1',
      '0xbf37154e267088cc026028ff3e17006d2d7dd2e2',
      '0x0d7cfb223db1dc316edeee8a03d1921561d9acef',
      '0xdc73ccf777986c69f2af9c4279c9f4c88b3903d7',
      '0xb3c7e019abbe87f7011d0ba2e0c16c6ac2d451bd',
      '0xd671339ae0f3d1e657c9d1e543c57a099c7b6813',
      '0x26e6bC91DD5fD81e5d761a1A8B83Cb7F71b31B07',
      '0x3be737678cc32b86f03b12b5af2f6f96ad3ae4cc',
      '0xe95945b323cf5527709a9ad19c45a65d65c63389',
      '0x9994B392045A1D2aEf5e72D2EF70b0F61e3A2322',
      '0x764f3658d11f50ed49d594d45ef02ecd911a1d86',
      '0x31815ab78494b9791c6e399b71efc104ca703953',
      '0xba2378da6a99104a169c64442e6d0206b014e3c0',
      '0x3fa7a13142cf6211c8924d72a015147b4c50ddde',
      '0xa8026fe64fe1ff5ac93f24f4749f2711ca6a8ecf',
      '0x8e6c9a6490aafc3989097777d784e07d7e1fc163',
      '0xf1b24fc6a1f77c9e14d99903c5bff537b20f28ed'

    ]
  );
  console.log(50);
  await sleep(4000);

  await ts.addAddressesToWhitelist(
    [
      '0x165f2236b6d14598100d5b260ffa8bca12efbd0f',
      '0x5b8e7ec751a440e32bd2ef951494e9f5d54ff10e',
      '0x8d5ca2fff61cf1deb5f67b1bb2760beea981325f',
      '0x3b84fb6ac226f2d201d5401b70b9bf4842349008',
      '0xd50f239e5049aa9d8d457ea2538aa3e591a28bb6',
      '0x99e805b58e5a327dd9a51a6b15dae013c469c409',
      '0x721d2fd61e977e9304a095ce4c3e327d32636e13',
      '0xa77704be1686808e6f0830dbad02ea596ea332dc',
      '0x6e9179b8fccb8db3d1aba7966060cbf0015af051',
      '0x65dc98515aa41abb23c74bbc346cf49dcec1b26d',
      '0xe23d9c9f9e2d99db8b5d9888f445340387c0f37e',
      '0x5c2c044208f7d2b09187027c972c0f4c0be36049',
      '0x4178f28cfb0b990a9425856cfff0f4c04a3ac1cd',
      '0xbd680338b781ccbdaafdf25e902f54b4a4974600',
      '0xc90bd272ce52806e48d88fc44af5d4eb97822bea',
      '0x162a6c96ae2787b8edaa4dbd869360cf5c8cf3af',
      '0x3524babc0cad0c1b8131208c0fc7be49e15e76d8',
      '0xd6091aeea9387904d596075c87a4dd0497f665b6',
      '0xf244111b02af9e8fdfc1a0c79c39bff397756489',
      '0xe60f094a50902e4e672c8a56cbaf95cd2af5b09d',
      '0x32df76ea74b032db8041fac08db4a5ee640504b9',
      '0x98d34d5e32d8dacef12e3961d876e3c1355ad52a',
      '0xc3fd9e66574b207518900ac9c09cc3e0e54e037c',
      '0x224fbdb50b547e3b463d3e889d600beea28438bc',
      '0x75b1134e9b58df93cd7daa5d26691c21ee73a403',
      '0x57410AaC925f2a9C3D0BfFCF3641475469645E6D',
      '0xb0781b293caa1846ee3f9c5a855d7590d4fc08ca',
      '0xce752b4003734c478f32a5ad90090d541e0acf93',
      '0x973888c179823177babe68926977beae164cafe4',
      '0xdca7ef41ef09a5558f9cf6bf71da484daa8f6a79',
      '0xb50a25e6aa6550169521a05869acabe0bcb353eb',
      '0x8b177f0479b8be8b88f53338d23eadd4b08db6b9',
      '0xbcfb8fcdfe6cbdd5ca11a78562403dc95778caab',
      '0x8bd635c8611821d0f92d8f7e69433a810919d4f1',
      '0x57579eee59de7b5a78b7a7e9a04836696ded12b8',
      '0xf6cfd63d0f1c951d1d9df0af739c9fb0e44b5b27',
      '0x88c4dfae405dc1ade4d196063fa56e93fed097cf',
      '0x5e39d01583572a816c5b30f56c0fd3c1793ff05e',
      '0x0193219fa8aec5ba753e39fef99640b112442f36',
      '0xc9dc0920ca4ae9affb824c5fb88a073f6190ce99',
      '0x57b7d3235be87a82d343eafe5358b08ed851d4c7',
      '0x284963fa5f524c5a2b1b1efa1ed8906bf810bc2e',
      '0xd63067b98e6c86b54c9ced77fd3e21caa5822ed1',
      '0x6871cb4a097c98325e950265a495c43833187974',
      '0xf7005ef1fc490ee6e9315f42602290ecc9aeacbd',
      '0x0b31e864240bfe93e5ecdd16159069908346c1e6',
      '0x77180dfed41a0bccf8e076f9a52c3a938b9ec105',
      '0xf8e7e0bc05e164b7f75d44b3191818a9fc8385c0',
      '0x138245d9c9104c15396ad5eee48b2d6bc791aee6',
      '0x0d9fc3fd9ad8fdadd457bb2ef3204bd314856c33'


    ]
  );
  console.log(100);
  await sleep(4000);

  await ts.addAddressesToWhitelist(
    [
      '0xac0eadb16c68cec3191faa564c4002d4f7a22099',
      '0xA72240Fd574Af9173d73aa6FC31bCBFc9328b448',
      '0x487e4f8abE2C1A55982924c16cB7abCA67ce4bE8',
      '0x294b8Ef3734026260c632c379906dd70Caf52431',
      '0x0942Df9590DaA704eC4f190521a1053954ed0e0E',
      '0x436874F55fA80eD0874aAABEA7ecE842873Ea471',
      '0xC895BFF121aC4297169f764596b73Acb0a14ec17',
      '0x8d79C63b103972b31F9beBA7AC7fA2aa3966ADF5',
      '0xD51381206bc76BD0928F6Eeaad8477A8c569d93A',
      '0xB720F95947cd3bd6E9714De5Bc8a9d6E826AEC85',
      '0x3fa92c59e7add64a3bf1fb5bbbf32ee0758142bb',
      '0x0B40a2044521af916dbA0A10cF86d66de9aB86bF',
      '0xFe3D648C759E298B73DE479530c4A8B7F6B0a9d1',
      '0xD33f5EA3bBF5245b6977c827d4802ffD439c90FC',
      '0x7F74C8C4a1f7B480b614E46cde69d7489630698F',
      '0x745673527e0df32B2a57c2FD3bBf108ee7792505',
      '0x77a159295cba0b270130c0548e0d613e9dae2a69',
      '0xd04c691c5d475a02675dd3902115052605084c23',
      '0xe5708ed6d40a6a7c5735595fd56b8841fcac2ebf',
      '0xc7372f366d98f60a1c274eed85a849c269f12dec',
      '0xF45C8C6997A25f7c48498859363850B068fFfb1E',
      '0xa3A6f716922E4E84F667a2b3219c1165ccE0c7Fe',
      '0x90fE3b46EB9b189A4570CBA4beF0778948fcd6FE',
      '0xF9225605F026fcd9A6AD60191111c0E0640fb201',
      '0xa884deb7e52522201118058a8981a5a18d99f60c',
      '0x3EbC594B3f06c18322265141f84B12407831B98E',
      '0x63ddcb917ed8e3edb4d7f1ecd060f9ddde3d1024',
      '0x733628b5Ac8a0E2cbAeb9D2061fFf39e41B90Ba3',
      '0xd6672E79916B2D8Ce0019EA4042f12230d2cab53',
      '0xf9760D7Eeb2c445F8D58FA772667E0E9B2CD05bD',
      '0xff7116560005a341f809bb6405260bbb0f2a1b45',
      '0xF744b161F6Cf24a8743F9f43DBd162636221E175',
      '0xB187EC302eb040CBde7B924575F59c7A51fa4eC9',
      '0x0000035d8CA0cE472455ACfF8B5bE3c7A9e0603D',
      '0xFBEc05B5C320E32a0404063E422C4a544b6A77c8',
      '0x47488ada4d20a74bfd576a0d21a6c00896a0d6da',
      '0x368e19cbcc8c7ec83120cb791276702cba3b51a0',
      '0x9ca8362c35DB2649614Cd4029Ab0067d285660ef',
      '0x446B4B5790c471737201008112673e575D0E63ad',
      '0x21E933CCefc74fbCec0E9E37264FF2D9f3087c36',
      '0x38af57582117bbaafd06ea1c50108e6b154796f3',
      '0x7a73eaE014Ac47A1075dc6A1f6943DfBAD776839',
      '0x0684caa313524993a71a96e2624dbf74145213E4'
    ]
  );
  console.log(143);
  await sleep(4000);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
