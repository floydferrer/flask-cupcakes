// $('.delete-cupcake').click(deleteCupcake);

// async function deleteCupcake(){
//     const id = $(this).data('id');
//     await axios.delete(`/api/cupcakes/${id}`);
//     $(this).parent().remove();
// }

const BASE_URL = 'http://127.0.0.1:5000/api'

//Create Cupcake HTML
function generateCupcakeHTML(cupcake){
    return `
        <div class="card col-xl-2 col-lg-3 col-md-4 col-sm-6 px-0" style="width: 400px;" data-id=${cupcake.id}>
        <img src="${cupcake.image}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${cupcake.flavor}</h5>
            <p class="card-text">Size: ${cupcake.size}</p>
            <p class="card-text">Rating: ${cupcake.rating}</p>
        </div>
        <button class="delete-cupcake btn btn-outline-danger mb-2">X</button>
        </div>
    `;
}

//Show Cupcake
async function showInitialCupcakes(){
    const response = await axios.get(`${BASE_URL}/cupcakes`);
    for (let cupcake of response.data.cupcakes){
        let newCupcake = $(generateCupcakeHTML(cupcake));
        $('.cupcakes-list').append(newCupcake);
    }
}

//Add Cupcake
$('#new-cupcake-form').on('submit', async function(evt){
    evt.preventDefault();

    let flavor = $('#form-flavor').val();
    let rating = $('#form-rating').val();
    let size = $('#form-size').val();
    let image = $('#form-image').val();

    const newCupcakeResponse = await axios.post(`${BASE_URL}/cupcakes`, {
        flavor,
        rating,
        size,
        image
    });

    let newCupcake = generateCupcakeHTML(newCupcakeResponse.data.cupcake);
    $('.cupcakes-list').append(newCupcake);
    $('#new-cupcake-form').trigger('reset');
});

//Delete Cupcake
$('.cupcakes-list').on('click', '.delete-cupcake', async function deleteCupcake(evt){
    evt.preventDefault();
    let $cupcake = $(evt.target).closest('div');
    let cupcakeID = $cupcake.attr('data-id')
    await axios.delete(`${BASE_URL}/cupcakes/${cupcakeID}`);
    $cupcake.remove();
});



showInitialCupcakes();