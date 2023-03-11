import AsyncStorage from "@react-native-async-storage/async-storage";

//st is short for state
function err(err) {
    console.log(err)
}

export default class Endpoints {
    constructor() {
        //this.url="http://192.168.161.202:8000/"
        this.url = "https://emachine.pythonanywhere.com/"
    }
    async setRequestOptions(method) {
        this.token = await AsyncStorage.getItem("token")
        this.requestOptions = {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${this.token}` },
        }
    }

    async categoriesList(st, addMessage) {
        await this.setRequestOptions("Get")

        try {
            console.log("eee")
            let response = await fetch(`${this.url}api/v1/menu/cat/List/`, this.requestOptions)

            let result = await response.json()
            st(result)
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }

    }

    async profile(st, method, addMessage, data,setEdit) {
        await this.setRequestOptions(method)
        if (method == "Put") {
            this.requestOptions.body = JSON.stringify(data)
            console.log(data)

        }

        try {
            console.log("eee")
            let response = await fetch(`${this.url}api/v1/client/profile/`, this.requestOptions)

            let result = await response.json()
            st(result)
            if (method == "Put") {
                console.log(result)
                setEdit(false)
                addMessage("Updated sucessfully")
    
            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }

    }

    async saveToken(st, addMessage) {
        await this.setRequestOptions("Post")
        this.requestOptions.body = JSON.stringify({ notification_token: st })
        try {
            console.log("eee")
            let response = await fetch(`${this.url}api/v1/save/notificationToken/`, this.requestOptions)

            let result = await response.json()
            if (result.message) {
                //addMessage(result.message)
                
                2+2
            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }

    }
    async initiatePayment(st, addMessage, orderedItemId) {
        await this.setRequestOptions("Post")

        try {
            console.log("eee")
            let response = await fetch(`${this.url}api/v1/initiate_payment/${orderedItemId}/`, this.requestOptions)

            let result = await response.json()
            console.log(result)
            st(result.authorization_url)
            if (result.message) {
                addMessage(result.message)
            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }

    }

    async deleteOrderItem(addMessage, orderItemId) {
        await this.setRequestOptions("Post")

        try {
            console.log("eee")
            let response = await fetch(`${this.url}api/v1/delete/orderItem/${orderItemId}/`, this.requestOptions)

            let result = await response.json()
            console.log(result)
            addMessage(result.message)
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }

    }


    async inc_or_dc_Cart(method, itemid, addMessage, quantity, sideDishes) {
        //used in the cart page
        console.log(`inside endpoint...sending quantity of ${quantity} and side dishes ${sideDishes}`)
        await this.setRequestOptions(method)
        console.log(sideDishes)
        if (sideDishes) {
            this.requestOptions.body = JSON.stringify({ quantity, side_dishes: sideDishes })

        } else {
            this.requestOptions.body = JSON.stringify({ quantity })
        }
        try {
            console.log("hey")
            let response = await fetch(`${this.url}api/v1/client/cart/${itemid}/`, this.requestOptions)

            let result = await response.json()
            let msg = result.message
            addMessage(msg)
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }

    }

    async GetFoodHomepage(st, method, addMessage) {

        //Get method returns list of items in desc order
        //Post method return list of highly rated items 
        await this.setRequestOptions(method)
        try {
            let response = await fetch(`${this.url}api/v1/food/all/`, this.requestOptions)
            let result = await response.json()
            if (method == "Get") {

                st(result.results)
                if (result.results.length == 0) {
                    st("")
                }
            } else {

                st(result.results)
                if (result.results.length == 0) {
                    st("")
                }
            }
        } catch (err) {
            addMessage("Check Internet connection")
        }
    }
    async placeOrder(st, method, addMessage, addy) {

        await this.setRequestOptions(method)
        this.requestOptions.body = JSON.stringify({ delivery_add: addy })
        try {
            console.log(method)
            let response = await fetch(`${this.url}api/v1/checkout/`, this.requestOptions)
            let result = await response.json()
            console.log(result)
            addMessage(result.message)
        } catch (err) {
            addMessage("Check Internet connection")
        }
    }
    async GetSidedishes(st, method, addMessage, vendorid) {

        //Get method returns list of items in desc order
        //Post method return list of highly rated items 
        await this.setRequestOptions(method)
        try {
            console.log(vendorid)

            let response = await fetch(`${this.url}api/v1/food/side_dishes/${vendorid}/`, this.requestOptions)
            let result = await response.json()
            if (method == "Get") {
                console.log(result)

                st(result.results)
            } else {
                console.log(result)

                st(result.results)

            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }
    }

    async FoodItemsByVendor(st, method, addMessage, vendorid) {
        //this is basically the hompage by all items belong to a particular vendor
        console.log(method)
        //Get method returns list of items in desc order
        //Post method return list of highly rated items 
        await this.setRequestOptions(method)
        try {
            let response = await fetch(`${this.url}api/v1/food/byVendor/${vendorid}/`, this.requestOptions)
            let result = await response.json()
            if (method == "Get") {
                st(result.results)
                if (result.results.length == 0) {
                    st("")
                }
            } else {
                st(result.results)
                if (result.results.length == 0) {
                    st("")
                }

            }
        } catch (err) {
            addMessage("Check Internet connection")
        }
    }

    async foodByCategory(st, addMessage, categoryId, currentPageState, currentPage_stFunc, currentFoodState, refresh_stFunc, location) {
        refresh_stFunc(true)
        await this.setRequestOptions("Post")
        this.requestOptions.body = JSON.stringify({ location: location })
        console.log(categoryId)
        try {
            let response = await fetch(`${this.url}api/v1/food/byCat/${categoryId}/?page=${currentPageState}`, this.requestOptions)

            let result = await response.json()
            if ("detail" in result) {
                currentPage_stFunc(0)
                refresh_stFunc(false)
            } else {
                console.log(result)

                st((cf) => [...cf, ...result.results])
                currentPage_stFunc((cp) => cp + 1)
                refresh_stFunc(false)
            }
        } catch (err) {
            console.log(err)
            refresh_stFunc(false)
            addMessage("Check Internet connection")
        }
    }

    async get_or_update_or_remove_FavouriteMeals(st, addMessage, method, refresh_stFunc, foodItemid, setAnimation) {
        if (["Post"].includes(method)) {
            await this.setRequestOptions(method)
            try {
                let response = await fetch(`${this.url}api/v1/favourites/${foodItemid}/`, this.requestOptions)

                let result = await response.json()
                //console.log(result)
                //st((cf) => [...cf, ...result.items])
                addMessage(result.message)
            } catch (err) {
                console.log(err)
                addMessage("Check Internet connection")
            }
        } else {
            refresh_stFunc(true)

            await this.setRequestOptions(method)
            try {
                console.log("faf")
                let response = null
                if (method == "Put") {
                    response = await fetch(`${this.url}api/v1/favourites/${foodItemid}/`, this.requestOptions)

                } else {
                    response = await fetch(`${this.url}api/v1/favourites/null/`, this.requestOptions)

                }

                let result = await response.json()
                console.log(result)
                if (result.items.length == 0) {
                    setAnimation(true)
                } else {
                    setAnimation(false)
                }
                st(result.items)
                console.log("gotten")
                refresh_stFunc(false)
            } catch (err) {
                console.log(err)
                refresh_stFunc(false)
                addMessage("Check Internet connection")
            }


        }

    }

    async SearchFood(st, method, addMessage, query, currentPagestate, currentPage_stFunc, foodCurrentstate, refresh_stFunc, location) {

        refresh_stFunc(true)
        await this.setRequestOptions("Post")
        this.requestOptions.body = JSON.stringify({ location: location })
        try {
            let response = null
            //if foodState is empty,user is trying to refresh the page...check flatlist
            response = await fetch(`${this.url}api/v1/search/food/${query}/?page=${currentPagestate}`, this.requestOptions)
            let result = await response.json()
            if ("detail" in result) {
                currentPage_stFunc(0)
                refresh_stFunc(false)
            } else {

                st((cf) => [...cf, ...result.results])
                if (result.results.length == 0) {
                    st("")
                }
                currentPage_stFunc((cp) => cp + 1)
                refresh_stFunc(false)
            }
        } catch (err) {
            refresh_stFunc(false)
            console.log(err)
            addMessage("Check Internet connection")
        }


    }
    async ListOfVendors(st, addMessage, categoryId, currentPageState, currentPage_stFunc, currentFoodState, refresh_stFunc, location) {
        refresh_stFunc(true)
        await this.setRequestOptions("Post")
        this.requestOptions.body = JSON.stringify({ location: location })
        console.log(categoryId)
        try {
            let response = await fetch(`${this.url}api/v1/vendor/list/?page=${currentPageState}`, this.requestOptions)

            let result = await response.json()
            if ("detail" in result) {
                currentPage_stFunc(0)
                refresh_stFunc(false)
            } else {
                console.log(result)

                st((cf) => [...cf, ...result.results])
                currentPage_stFunc((cp) => cp + 1)
                refresh_stFunc(false)
            }
        } catch (err) {
            console.log(err)
            refresh_stFunc(false)
            addMessage("Check Internet connection")
        }
    }
    async TrackOrder(st, method, addMessage, currentPagestate, currentPage_stFunc, foodCurrentstate, refresh_stFunc,setHeader) {
        console.log(419)
        refresh_stFunc(true)
        await this.setRequestOptions(method)
        try {
            let response = null
            //if foodState is empty,user is trying to refresh the page...check flatlist

            response = await fetch(`${this.url}api/v1/view_ordered_items_status/?page=${currentPagestate}`, this.requestOptions)
            let result = await response.json()
            if ("detail" in result) {
                currentPage_stFunc(0)
                refresh_stFunc(false)
            }else if(result.results.length==0){
                console.log(result.results)
                setHeader("No orders have been made")   
                refresh_stFunc(false)

            } else {
                console.log(result)
                setHeader("Track your orders")
                st((cf) => [...cf, ...result.results])
                currentPage_stFunc((cp) => cp + 1)
                refresh_stFunc(false)
            }
            
        } catch (err) {
            refresh_stFunc(false)
            console.log(err)
            addMessage("Check Internet connection")
        }
    }
    async NavBarTrackOrder(method, setHasNotifications) {
        await this.setRequestOptions(method)
        console.log("inside navbar")
        try {
            let response = null
            //if foodState is empty,user is trying to refresh the page...check flatlist

            response = await fetch(`${this.url}api/v1/view_ordered_items_status/?page=${1}`, this.requestOptions)
            let result = await response.json()
            if (result.results.length == 0) {
                setHasNotifications(null)

            } else {
                setHasNotifications(result.results.length)
                
            }

        } catch (err) {
            console.log(err)
        }

    }
    async sendFoodRating(addMessage, rating_number, foodid) {
        await this.setRequestOptions("Post")
        this.requestOptions.body = JSON.stringify({ rate: rating_number })
        try {
            let response = await fetch(`${this.url}api/v1/rate/food/${foodid}/`, this.requestOptions)

            let result = await response.json()
            addMessage(result.message)
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }

    }
    async sendVendorRating(addMessage, rating_number, vendorid) {
        await this.setRequestOptions("Post")
        this.requestOptions.body = JSON.stringify({ rate: rating_number })
        try {
            let response = await fetch(`${this.url}api/v1/rate/vendor/${vendorid}/`, this.requestOptions)

            let result = await response.json()
            addMessage(result.message)
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }

    }



}
//food/byVendor/<vendorid>/