# CMS in Sharetribe Flex

A content management system (CMS) as its name has suggested is place for you to manage your content, not matter what it is, there are many purposes behind why we should have a CMS in place, but this is something I'm sure most of us would agree on. No matter what your business is, you would most likely need a place to list out information to your targeted audience. It could be a blog article about how to make a maximize the profit when renting out one's house to how to assemble a rocket from scratch. 

I have a fair share of my implementation over the years with 20+ marketplace in Sharetribe Flex, here are a list of prominent tools that has gone through my coding hand (there are many more but I would just list a few notable one):
- Intercom (It's is most notably famous for being a CRM, but you can use it as CMS as well)
- Zendesk (Same as Intercom, famous for being a CRM but has its fair share of flexibility)
- Prismic
- Strapi
- Wordpress (Too famous)
- Wix

As you has probably noticed, there a just...too many services to choose from...So how should we choose our CMS services? Here are simple questions that I personally created, it is opinionated, I hope that it can help you out in the process of choosing.

## What do you need? Don't over engineering it...

One of the most common pitfall mistakes that I got from working with multiple start-ups/founders is the large scope of requirements that cause you to make regretful decision. There are certainly many services out there, but they have a wide range of features, if you don't know what you need and go for the biggest one. You are in for a bungee jump. Here are a couple of questions for get you started:

### 1) **How many people are there in your content team?**

Why this question is important? That is because some service charges by number of authors. You can certainly share your accounts but at the end of the day, when you have 10 writers and the service find out that there are multiple access at the same time, trouble will happen.

### 2) **Do you need an approval flow?**

This would certainly be a deal breaker for a team that has lots of content in and out. But if it's just you...you need to have more belief in yourself. 

### 3) **What is your must have degree of editing freedom?**

To put this into explanation, creating a content is a must for a CMS. But how far do you want to alter your content? Here is the scale that I usually give out and asked
1) Just free text is fine
2) Free text + image inserting
3) Free text + image inserting + embed video link
4) Different layout depends on the article

Remember that the more you choose, the more expensive it get and the heavier the implementation effort would be put on your funds.

### 4) **SEO?**

I always recommend everyone to have SEO in their articles from the start and check if the chosen services supports good SEO tags if your CMS will have public content. 

Not so much for private content because it make no sense to have SEO for a blog site that is used by internal users. Which should not be revealed in the first place.

### 5) **Sub-folder or Subdomain**

This is one of the most debatable decision in the list. Because there are [SEO experts](https://swankyagency.com/subdomain-seo-impact/#:~:text=Using%20a%20subdomain%20enables%20you,for%20improving%20your%20SEO%20performance) indicates that having subdomain will surely affects your main site's performance and confuse the crawl bot out.

But Google [confirms the otherwise](https://www.youtube.com/watch?v=uJGDyAN9g-g), suggesting that it is not the case. Sub-folder or Subdomain, the bot would be smart enough to figure itself out, so it makes no difference.

For me, the answer to this question would depending on your business nature and the budget that you have. But a quick rules of thumb:

- Subdomain would most of the time be cheaper to implement in Sharetribe Flex (excluding the recurrent fee).
- Subfolder would requires either you to reflect the service's component on the Flex site or parse the entire content to HTML (if it supported). So there are more works to do.

### 6) **Self-hosted or Hosted?**

Another debatable, yet important question because it related heavily on the recurrent cost that you needs to pay. To answer this question, I would suggest you to consider the advantages, risks and the draw backs each have.

#### Self-hosted

What you would gain:
- **Absolute freedom**. Everything is yours, the code, the infrastructure. You changes what you want.

What you risk:
- **Security**. Because most self-host software are open-sourced. The vulnerability is known publicly. So it is easier for penetrators to attack your site.
- **Budget management**. This is consider a risk because if you nailed it, you would have a much cheaper software compare to a cloud based solution. But that is an if, when your team does not have anyone to optimize the hosting, you would risk paying more than a cloud based solution.
- **Abandoned Software**. As stated earlier, most of the time, we would need to use an open-source projects to self-host. And all of those projects run a risk of being abandoned. But it's just a risk because if your business grew and you have your own development team before that point and implement a new one, everything is good.

The draw backs:
- **You need someone able to host the software**. This is always a deal breaker, especially if you are small, more than often we would face the situation where there are no-one to do it for you. And you just got lost in all the technical terms and docs.

#### Hosted 

What you would gain:
- **Constant Update**. Most of cloud based services take care of upgrading their software for you, so you should benefit from the new updates as soon as it come out.
- **Customer Support**. Should be self-explanatory


What you risk:
- **Budget management**. There are cheap plans and there are expensive plans. If you choose your need accordingly, you should be able to choose the most optimized plan with competitive pricing for you.
- **Support Time**. Because the codes do not belong to you, there would be that lag in responding to bugs and software issues. The biggest risk lies in the fact that your needs fall in a less prioritize queue, the work would get done much slower.
- **Your tool does not evolve with just your idea**. Because it is a product that everyone use, more than often the business will pivot their product toward larger audiences. If you are a part of it then it is nice, otherwise you would risk running with workaround and custom implementation around the system.

The draw backs:
- **There might not be a tool that fit all your need**.


On what we personally recommend, we would most of the time, use Prismic in large situation. Because it has a cheap pricing ($7/month) while offers a large of range of features. In terms of open source software, Strapi is what we suggested


## Integrating the service

Depending on what service you choose, there are 2 common implementation as we have all known:
- Subdomain
- Subfolder

For the Subdomain, it is a configuration with your hosted domain provider. Most of the paid service that you use would have good article supporting it. So I would focus solely on subfolder in `Sharetribe Flex Template`

The service that I use as an example would be `Prismic` but it would share a big part of similarity in how things are configured with most CMS services out there as well.

```
C4Context
  title System Context diagram for STFlex payout system
  Enterprise_Boundary(b0, "SystemBoundary") {
    Person(userA, "user A", "A user of the marketplace with created marketplace accounts.")

    Person(adminA, "admin A", "A admin of the marketplace with created Prismic accounts.")

    System(WebPage, "Marketplace site with subfolder content in Prismic")

    System_Ext(PrismicAdmin, "Prismic Admin Site", "For creating and publishing contents") 

    Rel(userA, WebPage, "View content page")
    Rel(adminA, PrismicAdmin, "Create and publish content using Prismic Slice")
    Rel(WebPage, PrismicAdmin, "Fetch document", "HTTP with access token")
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
  }
```

The general structure is as simple as that, for a more detailed implementation, here is what we would do:
1) Create an access token on Prismic for fetching data, you could hide this on the server and do some white-labeling if you want your content to be private (For paid subscription,..etc)
2) Setup a container for rendering Prismic component
3) Change the routes code and point to the newly created container
4) In the container use [Route Resolver](https://prismic.io/docs/route-resolver) 
5) When there is a user enter the site using the specified url for `Prismic`, we would parse the remaining URl to `@prismicio/helpers` and get an HTML in returned. Or alternatively, you can use Prismic `PrismicRichText` to parse the content on the template.


If you have re-done your framework in `Next.js` I would also recommend to take a look at Prismic [Slice Machine](https://prismic.io/docs/setup-nextjs). It's a low-code solution for adjusting the content layout accordingly. But this deserve to be in a whole article itself so I would just leave it here.


**Footer**
If you have any questions or want to contact us for help and reduce the development time, please feel free to email `tam.vu@journeyh.io`