# Flex out Sharetribe Flex payment (Part 1)

Have you ever encounter this situation before in your sharetribe Flex website?

**Customer**: `"I would like to purchase that shiny Nike, please!"`

**Seller**: `"Of course, here you go. That would be $100"`

**Customer**: `"That's too expensive, can you go lower? Maybe $80 or something. It's a used shoes, maybe adding up the socks?"`

**Seller**: `"That's fair, I accepted that"`

`...1 months later`

**Customer**: `"I would like a partial refund, your shoes has problems"`

**Seller**: 
```
We would love to, but unfortunately the system does not allow me to do that
```

After working with more than 30+ marketplaces and prospecting entrepreneur, that is the common situation that we saw occurred when the business is running. 

Don't get us wrong, Sharetribe Flex is a great masterpieces of its own, but there are always bound to be restriction due to its black box's nature. However, not everyone know what they could do to `Flex` out the problems. If you had that problems as well, no worry, there are multiple solution to overcome this. So bear with me in this journey.

```
TODO: insert image that indicate the start of a journey
```

In general, here are what we normally suggested to go around this:
1) Manual payment 
2) A payment processing system & A payout system

## Manual Payment

This may sound like a joke at first, but there are actually many legitimacy to this. To me at Journey Horizon, this is actually one of the thing that I advice the most to marketplace owners that is having payment related problems that needs to resolve.

Why?

*You have full control*

*It's adaptable*

*And it's fast*

These may sound controversy but if you take in the times to development a feature, to test code out and make sure nothing happens before delivering those code to production site. Manual handling became an essential weapon in your customer service arsenal.

In our time working with our marketplace friends, we found out that when something went wrong, your attitude and how you resolve rising problems contribute largely in helping retaining the customer base. Especially under drastic circumstances, the faster the issue is resolve, the better. *No one likes to have their money stuck*.


## A payment processing system & A payout system

But what if the site is too big, and you don't have enough time to do everything?

*Then the latter choice would be to code it*.

There are usually be 2 parts of the equation:
1) `A payment system`
2) `A payout system`

But here is the important question, I found most marketplace owners have for us before we moving on forward.
```
What about STFlex existing transaction? We paid for it, we don't want to scrap it!!!
```

```
TODO: insert sad/crying face meme
```

For the answer, we keep most of STFlex existing transaction and is actually only remove a part of STFlex transaction. We can do this because the amazing engineer in STFlex were making their codes in modules. And we can choose which modules we want to keep, which we want to put off.

For a refresher, here is what `STFlex existing transaction offer`:

**1)** A comprehensive `UI` that has `checkout page`, `transaction details page`, `inbox page`, `chat box` and `reviews`.

**2)** A review system

**3)** A state machine for managing transaction state 

**4)** Integration with Stripe for processing pay in amount.

Do you see where we are going with this? Yes, we would only remove number `4`. We modified `1` to fit our business and we keep `2` and `3`. 

But is it possible?
```
TODO: insert question face meme
```

Yes, it is. Because of how STFlex team implement their transaction process. You can edit their `edn` files and remove the integration with Stripe easily.

This leads to the following facts:

**1)** STFlex transaction became a ledger

**2)** You can make use of STFlex transaction state machine and configure your business rules

**3)** The current transaction system would still be the same with the newly added payment system on top

```
TODO: insert success kid meme
```

So how would we add the cherry on top of our transaction pie and make it more appealing to our user?

### Payment system

Let's take a look at this diagram that we drew:

```
C4Context
  title System Context diagram for STFlex payment system
  Enterprise_Boundary(b0, "SystemBoundary") {
    Person(customerA, "Customer A", "A customer of the marketplace with created marketplace accounts.")
    Person(customerB, "Customer B", "A customer of the marketplace with created marketplace accounts.")

    System(FlexSite, "Marketplace website", "Allows customers to view information of existing listings and make payments.")

    Enterprise_Boundary(b1, "PaymentSystem") {
     System_Ext(FlexTransactionBackend, "Flex Backend", "STFlex backend for handling transaction.") 

     System(PaymentProcessingService, "White labelled Payment Processing Service", "Our backend for processing money") 

     System_Ext(ThirdPartyPaymentProcessingService, "Payment Processing Service", "The payment service that we choose to integrate with such as Stripe, Paypal,...etc") 

     System(EventListener, "Transaction Event Listener", "Our backend for listening to upcoming Flex events using integration SDK") 
    }

    Rel(customerA, FlexSite, "View listings")
    Rel(customerB, FlexSite, "Make Payment")

    Rel(FlexSite, FlexTransactionBackend, "Record Transaction", "Flex SDK")
    Rel(FlexSite, PaymentProcessingService, "Processing Payment", "Using our own coded SDK/interface")
    Rel(PaymentProcessingService, ThirdPartyPaymentProcessingService, "Processing Payment", "Using payment service provided SDK")

    Rel(PaymentProcessingService, FlexTransactionBackend, "Update transaction state", "Integration SDK")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
  }
```

**Diagram 1**: C4 model System Context diagram for STFlex payment system

As you can see from the diagram above, in our payment system there are 3 additional player:
- The payment service
- Our own white-label payment service to add our own logic
- An event listener

I will skip the detailed implementation of each system because each deserve it owns articles. But here are a short re-cap of how we can do it:
- The payment service - You can choose between Stripe, Paypal, Zoho,...etc or even go with a mixture of them to provide as much payment method as possible
- Our own white-label payment service to add our own logic - Just need to setup a server using your preferred languages, mine was JS so I used `node` and `deno`.
- An event listener - For easy of use, I would suggest to use `AWS Lambda` or `Google Cloud function` that is wrapped by `Serverless` for ease of coding and deployment.

# Case study

So how should we go about with this implementation? Let me bring out a case study that we have experience.(The names would be altered for confidential reasons)

In ancient times, there exist a marketplaces called `Lakers`. The Lakers' marketplace were for buying luxury goods. Each transaction need to process in average $20,000 (Huge). Because of how large the transaction sum is, their `buyer` was skeptical of the site. They would prefer to go over something...more trustworthy such as `Paypal` or wire transfer. 

The marketplace owner were having the same trust issue problems, because they worried that the `seller` could just take the money and leave. There are insurances deals in place, but since it's the early stage of the startup, nothing was signed. If there are problems happened, the marketplace owner would need to pay using their own pocket.

The Lakers was operated by a single person that is juggling between their daily job so the investment upfront was not significant. That's why we suggested for a combination of manual approach with Flex's built-in system:

- For `seller` that trust them, then we would let those seller group (let's called it group A) proceed with normal STFlex flow and connect to their Stripe account.
- For `seller` that do not trust them (Group B). We would let them book to an admin listing to process money, while for the main transaction, we would just use it for showing information. The admin would need to do manual payout.

The solution was quick to do and at a low cost. The option to book through admin still stay true to the diagram that we gave above. With the `payment service` that we implement was actually `STFLex system itself`. 

After a while (2 years), the `lakers` was gaining attraction, they were building amazing things on top of their Flex sites. And it finally came the day where their sellers and buyers place full trust in them. But as the business grow, their business booking logic also grows:
- There were vouchers issued by `seller`
- There were promos issued by `buyer`
- There were additional negotiation flow

So we started coding for the Lakers, their own payment system. This time, we replace current admin processing with `Stripe` and because we were using our own `Stripe` integration. We don't need the provider to provide their account at first to create booking any more. 

And the best thing is, because of how we separate the concern of system out. STFlex main transaction was just for recording transaction, when the features gone out. We just need to replace the checkout page, all the transaction details page code were the same.


