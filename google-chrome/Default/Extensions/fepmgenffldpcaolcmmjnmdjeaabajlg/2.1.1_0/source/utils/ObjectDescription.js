

var ObjectDescription = (function() {
    
    return {
        
        getProperties : function( type ) {
            // console.log("type: " + type);
            this.properties =  
                { 
                    "Note" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.text",
                                "propertyLabel"  : "Content",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            }
                    ],
                    "Bookmark" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.url",
                                "propertyLabel"  : "Source",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "url", 
                            },
                            {
                                "propertyName"   : "properties.text",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            }
                    ],
                    "Recipe" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.servings",
                                "propertyLabel"  : "Servings",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.ingredientsText",
                                "propertyLabel"  : "Ingredients",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.preparationText",
                                "propertyLabel"  : "Preparation",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.source_url",
                                "propertyLabel"  : "Source",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "url", 
                            },
                    ],
                    "Task" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.date.properties.date",
                                "propertyLabel"  : "Due",
                                "propertyType"   : "DatePicker",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.category.name",
                                "propertyLabel"  : "Category",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.complete",
                                "propertyLabel"  : "Complete",
                                "propertyType"   : "Boolean",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.description",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            }
                    ],
                    "Appointment" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.date.properties.date",
                                "propertyLabel"  : "Start",
                                "propertyType"   : "DateTime",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.toDate.properties.date",
                                "propertyLabel"  : "End",
                                "propertyType"   : "DateTime",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.allDay",
                                "propertyLabel"  : "Allday",
                                "propertyType"   : "Boolean",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.note",
                                "propertyLabel"  : "Note",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                    ],
                    "GeneralList" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                    ],
                    /*"ShoppingList" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "" 
                            },
                    ],
                    "PackingList" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : ""
                            },
                    ],*/
                    "Movie" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.releaseDate",
                                "propertyLabel"  : "Release Date",
                                "propertyType"   : "DatePicker",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.cast",
                                "propertyLabel"  : "Cast",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.directors",
                                "propertyLabel"  : "Directors",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.writers",
                                "propertyLabel"  : "Writers",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.producers",
                                "propertyLabel"  : "Producers",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.plot",
                                "propertyLabel"  : "Plots",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.rating",
                                "propertyLabel"  : "Rating",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.awards",
                                "propertyLabel"  : "Awards",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.runTime",
                                "propertyLabel"  : "Runtime",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.url",
                                "propertyLabel"  : "Source",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "url", 
                            },
                    ],
                    "TVShow" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.releaseDate",
                                "propertyLabel"  : "Release Date",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.cast",
                                "propertyLabel"  : "Cast",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.directors",
                                "propertyLabel"  : "Directors",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.writers",
                                "propertyLabel"  : "Writers",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.producers",
                                "propertyLabel"  : "Producers",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.plot",
                                "propertyLabel"  : "Plots",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.rating",
                                "propertyLabel"  : "Rating",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.awards",
                                "propertyLabel"  : "Awards",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.season",
                                "propertyLabel"  : "Season",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.url",
                                "propertyLabel"  : "Source",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "url", 
                            },
                    ],
                    "Book" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.description",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.author",
                                "propertyLabel"  : "Author",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.publicationDate",
                                "propertyLabel"  : "Publication Date",
                                "propertyType"   : "DatePicker",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.cover",
                                "propertyLabel"  : "Cover",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.pages",
                                "propertyLabel"  : "Pages",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.genre",
                                "propertyLabel"  : "Genre",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.price",
                                "propertyLabel"  : "Price",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.source_url",
                                "propertyLabel"  : "Source",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "url", 
                            },
                            {
                                "propertyName"   : "properties.scraper_urls",
                                "propertyLabel"  : "More",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "url", 
                            },
                    ],
                    "Reminder" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.date.properties.date",
                                "propertyLabel"  : "Date",
                                "propertyType"   : "DateTime",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.enabled",
                                "propertyLabel"  : "Enabled",
                                "propertyType"   : "Boolean",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.description",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                    ],
                    "Album" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.description",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.artist",
                                "propertyLabel"  : "Artist",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.releaseDate",
                                "propertyLabel"  : "Release Date",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.format",
                                "propertyLabel"  : "Format",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.price",
                                "propertyLabel"  : "Price",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                    ],
                    "Product" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.description",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.price",
                                "propertyLabel"  : "Price",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.category",
                                "propertyLabel"  : "Category",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.manufacturer",
                                "propertyLabel"  : "Manufacturer",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.model",
                                "propertyLabel"  : "Model",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.scraper_urls",
                                "propertyLabel"  : "More",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "url", 
                            },
                            
                    ],
                    "Wine" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.label",
                                "propertyLabel"  : "Label",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.description",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.vineyard",
                                "propertyLabel"  : "Vineyard",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.varietal",
                                "propertyLabel"  : "Varietal",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.vintage",
                                "propertyLabel"  : "Vintage",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.price",
                                "propertyLabel"  : "Price",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.wineType",
                                "propertyLabel"  : "Wine Type",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.region",
                                "propertyLabel"  : "Region",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                    ],
                    "Restaurant" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.description",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.contactInfo",
                                "propertyLabel"  : "Address",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "",
                            },
                    ],
                    "Business" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.description",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.contactInfo",
                                "propertyLabel"  : "Address",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "",
                            },
                    ],
                    "File" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.description",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            }
                    ],
                    "Photo" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.description",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.url",
                                "propertyLabel"  : "Source",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "url", 
                            }
                    ],
                    "Video" : [
                            {
                                "propertyName"   : "name",
                                "propertyLabel"  : "Name",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "", 
                            },
                            {
                                "propertyName"   : "properties.description",
                                "propertyLabel"  : "Description",
                                "propertyType"   : "RichText",
                                "propertyStyle"  : "", 
                            },
                            {
                                /*"propertyName"   : "properties['/youtube/url']",*/
                                "propertyName"   : "properties.url",
                                "propertyLabel"  : "Source",
                                "propertyType"   : "Input",
                                "propertyStyle"  : "url", 
                            }
                    ]
            };
            
            if (type == null || type === undefined) {
                return this.properties;                
            } else {
                var result = this.properties[ type ];
                // console.log("result: " + JSON.stringify(result));
                if (result !== undefined) {
                    return result;
                }
            }
            return null;
        },
        
               
        
    };

})();

