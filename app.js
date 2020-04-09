var budgetController = (function(){
    var Expense = function(id,description,value){
        this.id = id;
        this.description= description;
        this.value=value; 

    };
    var Income = function(id,description,value){
        this.id = id;
        this.description= description;
        this.value=value;    
    };
    var data= {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum+=current.value;
        });
        data.totals[type]= sum;
        
    };
    return{
        addItem: function(type,des,val){
            var newItem,ID;
            //TO create ID
            if(data.allItems[type].length>0){
            ID = data.allItems[type][data.allItems[type].length-1].id +1;
            }else{
                ID=0;
            }
            
            //create new item based on 
            if(type === 'exp'){
                newItem = new Expense(ID,des,val);
                
            }else if (type==='inc'){
                newItem = new Income(ID,des,val);
            }
            //add to data structure
            data.allItems[type].push(newItem);
            
            return newItem;
        },
        deleteItem: function(type,id){
            //id 6
            //[1 4 5 6 8]
            // want to dlt 6
            var ids, index;
            
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);
            
            if(index!==-1){
                 data.allItems[type].splice(index,1);
                
            }
            
        },
        
        
        
        
        
        calculateBudget: function(){
            //cal total inc and exp
            calculateTotal('inc');
            calculateTotal('exp');
            
            // cal budget inc - exp
            data.budget = data.totals.inc- data.totals.exp;
            
            // cal percentage
            if(data.totals.inc>0){
                data.percentage= Math.round((data.totals.exp/data.totals.inc)*100);

            }else {
                data.percentage = -1;
            }
            
            
        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
            
        },
        testing: function(){
            console.log(data);
        
    }
    };
    
})();

var UIController = (function(){
    
    //some code
    
    var DOMstrings = {
        inptType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };
return{
    getInput: function(){
        return{
            type: document.querySelector(DOMstrings.inptType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value:  parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
    },
    addListItem: function(obj,type){
        var html,newHtml,element;
        
        //create html string 
            if(type==='exp'){
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type==='inc'){
                element = DOMstrings.incomeContainer;
                        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
        
        //replace place holder with actual data
        newHtml = html.replace('%id%',obj.id);
        newHtml = newHtml.replace('%description%',obj.description);
        newHtml= newHtml.replace('%value%',obj.value);
        //insert html into dom
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        
        
        
    },
    deleteListItem: function(selectorID){
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
         
    },
    
    clearFields: function(){
        var field,fieldsArr;
        fields = document.querySelectorAll(DOMstrings.inputDescription +', '+ DOMstrings.inputValue);
        fieldsArr= Array.prototype.slice.call(fields);
        fieldsArr.forEach(function(current, index, array){
            current.value = "";
            
        });
        fieldsArr[0].focus();
        
        
        
    },
    displayBudget: function(obj){
        document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
        
    if(obj.percentage>0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
    }else{
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
    }
            
    },
    
    getDOMstrings: function(){
    return DOMstrings;
}
        
}; 
    
})();   




var controller = (function(budgetctr,UIctr){
    //
    
    var setupEventListener = function(){
        var DOM= UIctr.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
    
    document.addEventListener('keypress',function(Event){
        if(Event.keyCode===13){
            ctrlAddItem();
        }
    });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        
        
    };
    
    
    var updateBudget = function(){
                
        //4 calculate budget
        budgetctr.calculateBudget();
        // return budget
        var budget = budgetctr.getBudget();
        //5 disply bdget to UI
        UIctr.displayBudget(budget);
        
    };
    
    
    var ctrlAddItem = function(){
        
        var input,newItem;
                //1 get i/p
         input = UIctr.getInput();
        console.log(input);
        
        if(input.description!==""  &&  !isNaN(input.value) && input.value> 0){
        //2 add itm to budget controller
         newItem= budgetctr.addItem(input.type,input.description,input.value);
        //3 add itm to UI 
        newItem = UIctr.addListItem(newItem,input.type);
        //clr input field
        UIctr.clearFields();
        //update budget
        updateBudget();
        }
        

        
    };
    var ctrlDeleteItem = function(event){
        var itemID,splitID,type,ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type= splitID[0];
            ID = parseInt(splitID[1]);
            //dlt from data structre
            budgetctr.deleteItem(type,ID);
            
            // dlt from UI 
            UIctr.deleteListItem(itemID);
            
            // show updated budget
            updateBudget();
            
            
        }
        
        
        
    };
    return{
        init: function(){
            console.log('application has started');
            
            UIctr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp:0,
                percentage: -1
            });
            setupEventListener();
        }
        
    };
    
    
})(budgetController,UIController);

controller.init(); 