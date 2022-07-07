// hrId = Human Readable Id


module.exports = (count)=> {

    const now = new Date();

	return	"CT" +
            now.getFullYear().toString().split("").pop() +
            "" +
            (now.getMonth() + 1) +
            "" +
            now.getDate() +
            "" +
            randomString(3) +
            "" +
            count;

}



function randomString(len) {
	var text = "";
	var charset =
		"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for (var i = 0; i < len; i++)
		text += charset.charAt(Math.floor(Math.random() * charset.length));
	return text;
}