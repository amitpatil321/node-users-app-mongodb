function deleteUser(uid) {
    var ask = window.confirm("Are you sure you want to delete this user?");
    if (ask) {
        document.location.href = "/delete/"+uid;
    }
}
$().ready(function(){
    
    $('.ui.form.frmlogin')
      .form({
        fields: {
          username : 'empty',
          password : 'empty'
        }
    });    

    $('.ui.form.frmregister')
      .form({
        fields: {
          name     : 'empty',
          username : 'empty',
          password : 'empty'
        }
    });    

    $('.ui.form.frmadduser')
      .form({
        fields: {
          name  : 'empty',
          email : 'empty',
          city  : 'empty'
        }
    });

    function explode(){
      console.log("count");
      $(".message").fadeOut("slow");
    }
    setTimeout(explode, 3000);

});    