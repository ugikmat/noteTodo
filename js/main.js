$(document).ready(function(){
    $('.delete-todo').on('click',function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/todos/'+id,
            success: function(response){
                window.location.href='/';
            },
            error:function(err){
                console.log(err);
            }
        });
    });


});

function addFields(){
    // Number of inputs to create
    // Container <div> where dynamic content will be placed
    var container = document.getElementById("detail");
    var i=container.hasChildNodes()?container.childNodes.length:0;
    // Create an <input> element, set its type and name attributes
    console.log(i);
    
    var input = document.createElement("input");
    input.type = "text";
    input.name = "detail"+i;
    input.className="form-control";
    container.appendChild(input);
    let del1 = container.childNodes.item(i);
    let del2 = container.childNodes.item(i+1);
    var a = document.createElement("a");
    a.setAttribute('class', 'btn btn-danger');
    // console.log(container.childNodes.length);
    a.onclick = function() {
        removeItem(i);
    };
    // console.log(container.childNodes.length);
    var newContent = document.createTextNode("Hapus");
    a.appendChild(newContent);
    container.appendChild(a);
    // console.log(container.childNodes.length);

    // Append a line break
    // container.appendChild(document.createElement("br"));
    // container.appendChild(document.createElement("br"));
}

function removeItem(i){
    var container = document.getElementById("detail");
    container.removeChild(container.childNodes.item(i));
    container.removeChild(container.childNodes.item(i+1));
}
