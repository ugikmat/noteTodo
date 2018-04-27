$(document).ready(function(){
    $('.delete-todo').on('click',function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        console.log('Deleting', id);
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
    $('.delete-detail').on('click',function(e){
        $target = $(e.target);
        const detail_id = $target.attr('detail-id');
        const id = $target.attr('data-id');
        console.log('Deleting', id, detail_id);
        $.ajax({
            type:'DELETE',
            url:'/todos/'+id+'/'+detail_id,
            success: function(response){
                window.location.href='/';
            },
            error:function(err){
                console.log(err);
            }
        });
    });
});