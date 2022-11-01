//console.log(pizzaJson)
//mapear usando arrow func.

let cart = [];
let modalQtd = 1;
let modalKey = 0;

//retorna um item que achou e o allselector retorna os valores achados
const a = (elementoSelecionado)=>document.querySelector(elementoSelecionado);
const as = (elementoSelecionado)=>document.querySelectorAll(elementoSelecionado);

//Listagem das pizzas
pizzaJson.map((pizza, indexDoItem) => {
    let pizzaItem = a('.models .pizza-item').cloneNode(true); //clono item, pega o item e tudo que tiver dentro dele
    

    //preencher as onformações em pizzaItem, listagem:
    pizzaItem.setAttribute('data-key', indexDoItem);
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;

    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault() //"previna a ação padrão" --> atualizar a tela, reset
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQtd = 1; //reseta a qtd para 1
        modalKey = key;

        //preencher as infos encontradas
        a('.pizzaBig img').src = pizzaJson[key].img;
        a('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        a('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        a('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        a('.pizzaInfo--size.selected').classList.remove('selected');        
        as('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        a('.pizzaInfo--qt').innerHTML = modalQtd;

        
        //mostrar modal
        a('.pizzaWindowArea').style.opacity = 0; 
        //mostrar modal
        a('.pizzaWindowArea').style.display = 'flex'; 
        setTimeout(()=>{
            a('.pizzaWindowArea').style.opacity = 1; //mostrar modal
       }, 200); //200milisegundos = 1/5 de 1 segundo

    });

        //oq add no carrinho e no modal, identificar qual pizza foi selecionada

    a('.pizza-area').append(pizzaItem);
     // append faz com que pegue o conteúdo que já tem dentro da área e add mais outro conteúdo
     //o innerHTML substitui o conteudo 

});

// Eventos do MODAL
function closeModal(){
    a('.pizzaWindowArea').style.opacity = 0; 
    setTimeout( () => {
        a('.pizzaWindowArea').style.display = 'none';
    }, 500);
};

as('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((pizza) => {
    pizza.addEventListener('click', closeModal);
});

//fazer validação, valor tem que ser <= 1
a('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQtd > 1) {
        modalQtd--;
        a('.pizzaInfo--qt').innerHTML = modalQtd;
    }
});

a('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modalQtd++;
    a('.pizzaInfo--qt').innerHTML = modalQtd;//novo valor da variável MODAL
});

as('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    //marca o item que foi clicado e desmarca o que estava selecionado 
    size.addEventListener('click', () =>{
        a('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    });
});

a('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //INFOS OBRIGATÓRIAS NO CARRINHO:
    //Qual a pizza?
    //Quantas pizzas
    //Qual o tamanho?
    
    let size = parseInt(a('.pizzaInfo--size.selected').getAttribute('data-key'));

    //OBS: pizzas tamanhos diferentes separa
    let identifier = pizzaJson[modalKey].id + '@' + size;

    //verificar se já tem item no carrinho 
    let key = cart.findIndex((item) =>  item.identifier == identifier);


    if( key > -1) { //se achar o item 
        cart[key].qt += modalQtd;
    }
    else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size, //size = size:size
            qt: modalQtd
        });
    }
    updateCart();
    closeModal();
});

//carrinho no mobile
a('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        a('aside').style.left = '0';
    }
});
a('.menu-closer').addEventListener('click', ()=>{
    a('aside').style.left = '100vw';
});

function updateCart() {
    a('.menu-openner span').innerHTML = cart.length; //carrinho no mobile

    if(cart.length > 0) {
        a('aside').classList.add('show');
        a('.cart').innerHTML = ''; 

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);// (==) para buscar info, alterar(=)
            subtotal += pizzaItem.price * cart[i].qt;


            let cartItem = a('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 2: 
                    pizzaSizeName = 'G'
                    break;
            }


            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1); // remove o item 
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;  
                updateCart(); //modifica na tela
            });
            

            a('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        a('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        a('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        a('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }
    else{
        a('aside').classList.remove('show');
        a('aside').style.left = '100vw'; // no carrinho mobile 
    }
}


//DATA-KEY = info especifica de tal div, o item exibibido naquela div 