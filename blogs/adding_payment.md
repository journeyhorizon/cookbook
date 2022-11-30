# Adding new payment provider to Sharetribe Flex (Part 1)

Have you ever encounter the situation where Sharetribe Flex payment system was too limited for your use case? You want to have partial refund, you want to integrate specific payment method that is available widely in your country such as Paypal or you want to add subscription to your existing sites.

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

After implementing the system, everything should works like this:

1. There will be multiple checkout page for multiple payment processors: Stripe, Paypal,...etc.

2. When a user enter checkout page, depends on the payment method that listing support, we would render the correspond checkout page.

3. If the user choose an external checkout flow (Paypal for example) on the `CheckoutPage.duck` we would use the `external flow booking alias` that you have created for it.

4. When our buyer start entering they payment information by either enter their credit card, login to Paypal,...etc. We would create a transaction in pending state that requires an admin approval (by code)

5. On the payment processor site, we would have a webhook to fire off success transaction event to our server. When the hook is fired, we would detect what transactions was deemed to be a success. We use Flex integration SDK to update the transaction status and transition it to `confirmed-payment`

6. The rest would be your normal business flow

7. In case there are refund, dispute that requires refund. Depends on if your site has code the refund button or requires the admin to go in the payment processor dashboard and issue the refund. We would also fire another webhook to the server and add refund information to the transaction metadata.

That should basically it, you have yourself a functional payment system. 

**Footer**
If you have any questions or want to contact us for help and reduce the development time, please feel free to email `tam.vu@journeyh.io`