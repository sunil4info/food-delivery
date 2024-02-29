export default {
	Login: async () => {
		const user = await UserLogin.run();
		console.log(user);
		if(user.length > 0){
			navigateTo('Delivery Tracker');
		}else{
			showAlert('EmailId or Password is wrong.')
		}
	}
}