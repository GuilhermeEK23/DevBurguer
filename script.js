const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = []

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function (){
    uppdateCartModal()
    cartModal.style.display = "flex"
})

//Fechar o modal quando clicar fora ou quando clicar no botão fechar
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal || event.target === closeModalBtn){
        cartModal.style.display = "none"
    }
})

//Adicionar produto no carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

//Função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        //Se o item já existi na lista, aumenta apenas a quantidade +1
        existingItem.quantity++
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1,
        })
    }

    uppdateCartModal()
}

//Atualizar o carrinho
function uppdateCartModal(){
    cartItemsContainer.innerHTML = ""
    let total = 0
    let quantidade = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <div>
                    <button class="remove-item-modal-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            </div>
        `
        total += item.price * item.quantity
        quantidade += item.quantity
        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    cartCounter.textContent = quantidade

}

//Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-item-modal-btn")){
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name)
    }
})

//Função para remover item do carrinho
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]
        if (item.quantity > 1){
            item.quantity--
            uppdateCartModal()
            return
        }
        cart.splice(index)
        uppdateCartModal()
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        Toastify({
            text: "Ops, o restaurante está fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #ef4444, #ef7777)",
            },
            onClick: function(){} // Callback after click
        }).showToast();

        return
    }

    if(cart.length === 0) return
    if(addressInput.value == ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    //Enviar dados para a API do Whats
    const cartItem = cart.map((item) => {
        return(
            `${item.name} Quantidade: ${item.quantity} Preço: R$ ${item.price} | `
        )
    }).join("")
    
    const message = encodeURIComponent(cartItem)
    const phone = "69992241605"

    window.open(`https://wa.me/${phone}?text=${message} Endereço ${addressInput.value}`, "_blank")

    cart = []
    uppdateCartModal()
    addressInput.value = ""
})

//Verificar a hora e manipular o card horário
function checkRestaurantOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora <= 22
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()
if(isOpen){
    spanItem.classList.add("bg-green-600")
    spanItem.classList.remove("bg-red-500")
} else {
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-600")
}